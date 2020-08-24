import { injectable, inject } from 'tsyringe';

import IGroupsRepository from '@modules/users/repositories/IGroupsRepository';
import IUsersGroupsRepository from '@modules/users/repositories/IUsersGroupsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

import Group from '../infra/typeorm/entities/Group';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user: User;
  groups: Array<{
    id: string;
  }>;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,

    @inject('UsersGroupsRepository')
    private usersGroupsRepository: IUsersGroupsRepository,
  ) {}

  public async execute({ user, groups }: IRequest): Promise<Group> {
    const checkUserExists = await this.usersRepository.findById(user.id);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const existentGroups = await this.groupsRepository.findAllById(groups);

    if (!existentGroups.length) {
      throw new AppError('Could not find group with the ids');
    }

    const serializaduserGroups = groups.map(group => {
      console.log('meu order_product:::', group);
      return {
        user_id: user.id,
        group_id: group.id,
      };
    });

    this.usersGroupsRepository.create(serializaduserGroups);

    return user;
  }
}

export default CreateUserService;
