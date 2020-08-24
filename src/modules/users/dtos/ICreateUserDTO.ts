import Group from '../infra/typeorm/entities/Group';

interface IGroup {
  group: Group;
}

export default interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  user_groups: IGroup[];
}
