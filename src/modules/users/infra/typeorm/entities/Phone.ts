import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('phones')
class Phone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prefix: string;

  @Column()
  number: string;

  @Column()
  person_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Phone;
