import User from '../infra/typeorm/entities/User';

interface ICreateUserGroupsDTO {
  user_id: string;
  group_id: string;
}

export default interface IUsersGroupsRepository {
  create(data: ICreateUserGroupsDTO): Promise<User>;
  save(group: ICreateUserGroupsDTO): Promise<ICreateUserGroupsDTO>;
}
