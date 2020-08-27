import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
} from 'typeorm';

import Product from './Product';

@Entity('sections')
class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Product, product => product.section)
  products: Product[];

  @Column()
  name: string;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default Section;
