import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';

@Injectable()
export class WalletService {
    constructor(
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    ) { }

    // Create a new wallet
    async createWallet(userId: string, walletNumber: string, name: string, currency: string, balance: number): Promise<WalletDocument> {
        try {
            const existingWallet = await this.walletModel.findOne({ walletNumber });
            if (existingWallet) {
                throw new BadRequestException('Wallet number must be unique');
            }

            const newWallet = new this.walletModel({
                walletNumber,
                balance,
                name,
                userId,
                currency,
            });
            return newWallet.save();
        } catch (error) {
            throw new BadRequestException('Error in creating wallet');
        }

    }

    // Get all wallets for a specific user
    async getUserWallets(userId: string): Promise<WalletDocument[]> {
        try {
            return this.walletModel.find({ userId }).exec();
        } catch (error) {
            throw new BadRequestException('Error in getting user wallets');
        }
    }

    // Get wallets with optional filters (walletNumber and walletName)
    async getAllWallets(walletNumber?: string, walletName?: string): Promise<WalletDocument[]> {
        try {
            const query: any = {};
            if (walletName) query.name = walletName;
            if (walletNumber) query.walletNumber = walletNumber;
            return this.walletModel.find(query).exec();
        } catch (error) {
            throw new BadRequestException('Error in getting all wallets');
        }

    }

    // Find wallet by wallet number
    async findWalletByNumber(walletNumber: string): Promise<WalletDocument> {
        try {
            const wallet = await this.walletModel.findOne({ walletNumber });
            if (!wallet) {
                throw new NotFoundException(`Wallet with number ${walletNumber} not found`);
            }
            return wallet;
        } catch (error) {
            throw new BadRequestException('Error in finding wallet by number');
        }

    }

    // Get wallet by ID
    async getWalletById(walletId: string): Promise<WalletDocument> {
        try {
            const wallet = await this.walletModel.findById(walletId).exec();
            if (!wallet) {
                throw new NotFoundException('Wallet not found');
            }
            return wallet;
        } catch (error) {
            throw new BadRequestException('Error in getting wallet by id');
        }

    }

    // Update wallet balance
    async updateWalletBalance(walletId: string | any, newBalance: number): Promise<WalletDocument> {
        try {
            const wallet = await this.getWalletById(walletId);
            wallet.balance = newBalance;
            return wallet.save();
        } catch (error) {
            throw new BadRequestException('Error in updating wallet balance');

        }

    }

    // Delete a wallet
    async deleteWallet(walletId: string): Promise<void> {
        try {
            const wallet = await this.getWalletById(walletId);
            await wallet.deleteOne();
        } catch (error) {
            throw new BadRequestException('Error in deleting wallet');
        }
    }

}
