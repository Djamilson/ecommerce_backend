import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('credit_cards')
class CreditCards {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  card_id: string;

  @Column()
  number: string;

  @Column()
  holder_name: string;

  @Column()
  expiration_date: string;

  @Column()
  brand: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default CreditCards;
