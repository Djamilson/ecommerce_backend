import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transaction_id: string;

  @Column()
  order_id: string;

  @Column()
  status: string;

  @Column()
  authorization_code: string;

  @Column()
  brand: string;

  @Column()
  authorized_amount: number;

  @Column()
  tid: string;

  @Column()
  installments: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
