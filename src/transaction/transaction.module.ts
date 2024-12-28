import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionEntity } from './entities/transaction.entity';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { WalletModule } from '../wallet/wallet.module';
import { RedisModule } from '../redis/redis.module'; // Import RedisModule
import { CurrencyModule } from '../currency/currency.module';
import { User } from '../auth/entities/user.entity'; // Adjust the path as per your structure

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionEntity, User]),
        MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
        WalletModule,
        RedisModule,
        CurrencyModule,
    ],
    controllers: [TransactionController],
    providers: [TransactionService],
})
export class TransactionModule { }
