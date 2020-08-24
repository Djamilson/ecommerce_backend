import { getRepository, Repository } from 'typeorm';

import ICreateUserGroupsDTO from '@modules/users/dtos/ICreateUserGroupsDTO';
import IUsersGroupsRepository from '@modules/users/repositories/IUsersGroupsRepository';

import UsersGroups from '../entities/UsersGroups';

class UsersGroupsRepository implements IUsersGroupsRepository {
  private ormRepository: Repository<UsersGroups>;

  constructor() {
    this.ormRepository = getRepository(UsersGroups);
  }

  public async create({
    user,
    group,
  }: ICreateUserGroupsDTO): Promise<UsersGroups> {
    const newUserGroups = await this.ormRepository.create({
      user_id: user.id,
      group_id: group.id,
    });

    await this.ormRepository.save(newUserGroups);

    return newUserGroups;
  }
}

export default UsersGroupsRepository;
