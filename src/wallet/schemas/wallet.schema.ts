import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet {
    @Prop({ required: true, unique: true }) // Ensure walletNumber is unique
    walletNumber: string;

    @Prop({ required: true }) // Balance is required
    balance: number;

    @Prop({ required: true }) // Name is required
    name: string;

    @Prop({ required: true }) // Currency is required
    currency: string;

    @Prop({ required: true }) // UserId is required (not unique to allow multiple wallets per user)
    userId: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
