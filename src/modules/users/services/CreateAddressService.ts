import { injectable, inject } from 'tsyringe';

// import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Address from '../infra/typeorm/entities/Address';
import IAddressesRepository from '../repositories/IAddressesRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  number: number;
  street: string;
  complement: string;
  zip_code: string;
  neighborhood: string;
  user_id: string;
  city_id: string;
}

@injectable()
class CreateAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    number,
    street,
    complement,
    zip_code,
    neighborhood,
    user_id,
    city_id,
  }: IRequest): Promise<Address> {
    const checkUserExists = await this.usersRepository.findById(user_id);

    if (!checkUserExists) {
      throw new AppError('Email address already used.');
    }
    const { person_id } = checkUserExists;

    const checkAddressExists = await this.addressesRepository.findByAddress({
      number,
      street,
      complement,
      zip_code,
      neighborhood,
      person_id,
      city_id,
    });

    if (checkAddressExists) {
      throw new AppError('Address already used.');
    }

    const addressSerealizable = {
      number,
      street,
      complement,
      zip_code,
      neighborhood,
      person_id,
      city_id,
    };

    const address = this.addressesRepository.create(addressSerealizable);

    return address;
  }
}

export default CreateAddressService;
