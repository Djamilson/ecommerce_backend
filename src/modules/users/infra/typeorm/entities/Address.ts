import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('addresses')
class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  number: number;

  @Column()
  street: string;

  @Column()
  complement: string;

  @Column()
  zip_code: string;

  @Column()
  neighborhood: string;

  @Column()
  person_id: string;

  @Column()
  city_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Address;
