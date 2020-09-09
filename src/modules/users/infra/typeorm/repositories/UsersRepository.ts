import { getRepository, Repository, Not } from 'typeorm';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import Person from '../entities/Person';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormUserRepository: Repository<User>;

  private ormPersonRepository: Repository<Person>;

  constructor() {
    this.ormUserRepository = getRepository(User);
    this.ormPersonRepository = getRepository(Person);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.ormUserRepository.findOne(id, {
      relations: ['person', 'user_groups', 'user_groups.group'],
    });

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    console.log('email, password ', email);
    const person = await this.ormPersonRepository.findOne({
      where: { email },
    });

    console.log('email, password ', email);
     console.log('ppp', person);
    let user;

    if (person) {
      user = await this.ormUserRepository.findOne({
        where: { person_id: person.id },
        relations: ['person'],
      });
    }

    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormUserRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      users = await this.ormUserRepository.find();
    }

    return users;
  }

  public async create(user: ICreateUserDTO): Promise<User> {
    const newUser = this.ormUserRepository.create(user);

    await this.ormUserRepository.save(newUser);

    return newUser;
  }

  public async save(user: User): Promise<User> {
    return this.ormUserRepository.save(user);
  }
}

export default UsersRepository;
