import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionEntity } from './entities/transaction.entity';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { WalletService } from '../wallet/wallet.service';
import { RedisService } from '../redis/redis.service';
import { User } from '../auth/entities/user.entity'; // Adjust the path as per your structure
import { CurrencyService } from '../currency/currency.service'; // Import the service

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectModel(Transaction.name)
        private readonly transactionModel: Model<TransactionDocument | any>,
        private readonly walletService: WalletService,
        private readonly redisService: RedisService,
        private readonly dataSource: DataSource,
        private readonly currencyService: CurrencyService, // Inject the CurrencyService
    ) { }

    async sendMoney(
        senderWallet: string,
        receiverWallet: string,
        amount: number,
    ): Promise<any> {
        // Fetch sender and receiver wallets
        const senderWalletObj = await this.walletService.findWalletByNumber(senderWallet);
        const receiverWalletObj = await this.walletService.findWalletByNumber(receiverWallet);

        if (!senderWalletObj) throw new NotFoundException('Sender wallet not found');
        if (!receiverWalletObj) throw new NotFoundException('Receiver wallet not found');

        if (senderWalletObj.balance < amount) {
            throw new BadRequestException('Insufficient balance');
        }

        // Fetch sender and receiver users
        // Fetch sender and receiver users from PostgreSQL
        const senderUser = await this.userRepository.findOne({ where: { id: Number(senderWalletObj.userId) } });
        const receiverUser = await this.userRepository.findOne({ where: { id: Number(receiverWalletObj.userId) } });

        // Handle currency conversion
        const conversionRate = await this.getConversionRate(senderWalletObj.currency, receiverWalletObj.currency);
        const convertedAmount = amount * conversionRate;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Deduct from sender wallet
            senderWalletObj.balance -= convertedAmount;
            await this.walletService.updateWalletBalance(senderWalletObj._id, senderWalletObj.balance);

            // Add to receiver wallet
            receiverWalletObj.balance += amount;
            await this.walletService.updateWalletBalance(receiverWalletObj._id, receiverWalletObj.balance);

            // Log transaction in PostgreSQL
            const transaction = new TransactionEntity();
            transaction.senderWallet = senderWallet;
            transaction.receiverWallet = receiverWallet;
            transaction.amount = amount;
            transaction.status = 'Outbound';
            transaction.receiver_currency = receiverWalletObj.currency || "USD",
                transaction.total = convertedAmount;
            transaction.fee = conversionRate;
            transaction.sender = senderUser; // Pass the complete User object
            transaction.receiver = receiverUser; // Pass the complete User object

            await queryRunner.manager.save(transaction);

            // Save to MongoDB for quick retrieval
            await this.transactionModel.create({
                senderWallet,
                receiverWallet,
                amount,
                receiver_currency: receiverWalletObj.currency,
                status: 'Outbound',
                fee: 0,
                total: convertedAmount,
                senderId: senderWalletObj.userId,
                receiverId: receiverWalletObj.userId,
                postgreSQLId: transaction.id
            });

            // Commit transaction
            await queryRunner.commitTransaction();
            return { message: 'Transaction successful' };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Transaction failed:', error.message);
            throw new BadRequestException('Transaction failed');
        } finally {
            await queryRunner.release();
        }
    }

    async getTransactions(
        userId: string,
        page: number,
        limit: number,
        filters?: any,
        isAdmin: boolean = false,
    ): Promise<any> {
        try {
            const query = this.transactionRepository.createQueryBuilder('transaction');

            // Add admin/user-specific filter
            if (!isAdmin) {
                query.andWhere(
                    '(transaction.senderId = :userId OR transaction.receiverId = :userId)',
                    { userId },
                );
            }



            // 2. Status filter
            if (filters?.status) {
                query.andWhere(
                    `(transaction.status = :status)`,
                    {
                        userId,
                        status: `${filters.status}`,
                    },
                );
            }


            if (filters.date) {
                const start = new Date(filters.date.start).toISOString();
                const end = new Date(`${filters.date.end}T23:59:59.999Z`).toISOString();

                query.andWhere('transaction.createdAt BETWEEN :start AND :end', {
                    start,
                    end,
                });
            }
            // Join related user data for sender and receiver
            query
                .leftJoinAndSelect('transaction.sender', 'sender')
                .leftJoinAndSelect('transaction.receiver', 'receiver');
            // Sorting and pagination
            query.orderBy('transaction.createdAt', 'DESC');
            query.skip((page - 1) * limit).take(limit);
            // Execute query and get results
            const [transactions, total] = await query.getManyAndCount();

            return {
                transactions,
                total,
                page,
                pages: Math.ceil(total / limit),
            };
        } catch (error) {
            throw new BadRequestException('Transactions Error');
        }

    }

    private async getConversionRate(from: string, to: string): Promise<number> {
        const cacheKey = `rate:${from}:${to}`;
        const cachedRate = await this.redisService.get(cacheKey);

        if (cachedRate) {
            return parseFloat(cachedRate);
        }

        // Use CurrencyService to fetch the conversion rate
        const rate = await this.currencyService.getConversionRate(from, to);

        // Cache the rate for 1 hour
        await this.redisService.set(cacheKey, rate.toString(), 3600);

        return rate;
    }
    async updateTransactionStatus(transactionId: string, status: string): Promise<any> {
        // Find the transaction by ID
        try {
            const transaction = await this.transactionRepository.findOne({ where: { id: transactionId } });

            if (!transaction) {
                throw new NotFoundException('Transaction not found');
            }
            const mongoTransaction = await this.transactionModel.findOne({ postgreSQLId: transactionId });

            if (mongoTransaction) {
                mongoTransaction.status = status;
                await mongoTransaction.save();
            } else {
                throw new NotFoundException('Transaction not found in MongoDB');
            }
            // Update the status
            transaction.status = status;

            // Save the updated transaction back to the database
            await this.transactionRepository.save(transaction);
            // Update the status in MongoDB

            return { message: 'Transaction status updated successfully', transaction };
        } catch (error) {
            throw new BadRequestException('Error in updating Status');
        }

    }
    async getDashboardOverview(userId: string): Promise<any> {
        // Fetch wallets for the user
        try {
            const wallets = await this.walletService.getUserWallets(userId);
            const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

            // Get the current month
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            // Fetch transactions
            const transactions = await this.transactionModel.find({
                $or: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            });
            // Filter and calculate incomes and expenses
            const incomes = transactions.filter(
                (txn) =>
                    txn.status === 'Inbound' &&
                    new Date(txn.createdAt).getMonth() === currentMonth &&
                    new Date(txn.createdAt).getFullYear() === currentYear,
            );

            const expenses = transactions.filter(
                (txn) =>
                    txn.status === 'Outbound' &&
                    new Date(txn.createdAt).getMonth() === currentMonth &&
                    new Date(txn.createdAt).getFullYear() === currentYear,
            );

            const totalIncome = incomes.reduce((sum, txn) => sum + txn.amount, 0);
            const totalExpense = expenses.reduce((sum, txn) => sum + txn.amount, 0);

            // Get the recent 5 transactions
            const recentTransactions = transactions
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 5);

            const formatTrans = [];
            if (recentTransactions.length) {
                for (let tran of recentTransactions) {
                    const senderUser = await this.userRepository.findOne({ where: { id: Number(tran.senderId) } });
                    const receiverUser = await this.userRepository.findOne({ where: { id: Number(tran.receiverId) } });
                    formatTrans.push({
                        ...tran._doc,
                        senderObj: senderUser,
                        receiverObj: receiverUser,
                    })
                }
            }
            const dateStandards: any = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }
            const labels = incomes.length ? incomes.map((txn) => txn.createdAt.toLocaleDateString('en-US', dateStandards)) : expenses.map((txn) => txn.createdAt.toLocaleDateString('en-US', dateStandards))
            return {
                totalBalance,
                totalIncome,
                totalExpense,
                recentTransactions: formatTrans,
                activityChart: {
                    labels: labels,
                    incomes: incomes.map((txn) => txn.total), // Data for incomes
                    expenses: expenses.map((txn) => txn.total), // Data for expenses
                },
            };
        } catch (error) {
            throw new BadRequestException('Error in getting dashboard Data');
        }

    }

}
