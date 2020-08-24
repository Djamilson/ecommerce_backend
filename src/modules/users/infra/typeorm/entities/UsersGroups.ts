import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

import Group from '@modules/users/infra/typeorm/entities/Group';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('users_groups')
class UsersGroups {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.user_groups)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Group, group => group.group_groups)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column()
  group_id: string;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default UsersGroups;
