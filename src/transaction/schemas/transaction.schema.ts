import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
    @Prop({ required: true })
    senderWallet: string;

    @Prop({ required: true })
    receiverWallet: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    receiver_currency: string;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    fee: number;

    @Prop({ required: true })
    total: number;

    @Prop({ required: true })
    senderId: string;

    @Prop({ required: true })
    receiverId: string;

    @Prop({ required: true })
    postgreSQLId: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
