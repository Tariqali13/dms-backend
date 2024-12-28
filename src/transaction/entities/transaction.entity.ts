import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity'; // Adjust the path as per your structure

@Entity('transaction_entity')
export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    senderWallet: string;

    @Column()
    receiverWallet: string;

    @Column('decimal')
    amount: number;

    @Column({ default: "USD" })
    receiver_currency: string;

    @Column()
    status: string;

    @Column('decimal', { default: 0 })
    fee: number;

    @Column('decimal')
    total: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'receiverId' })
    receiver: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
