import { inject, injectable } from 'tsyringe';

import IAddressesRepository from '../repositories/IAddressesRepository';

interface IState {
  id: string;
  name: string;
}

interface ICity {
  id: string;
  name: string;
  state: IState;
}

interface IPhone {
  id: string;
  prefix: string;
  number: string;
}

interface IPerson {
  id: string;
  name: string;
  email: string;
  status: string;
  privacy: string;
  avatar: string;
  address_id_man: string;
  phone: IPhone;
  cpf: string;
  rg: string;
  rgss: string;
  birdth_date: Date;
}

export interface IAddress {
  person: IPerson;
  id: string;
  number: number;
  street: string;
  complement: string;
  zip_code: string;
  neighborhood: string;
  user_id: string;
  city: ICity;
}

@injectable()
class ListAddressesService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute(person_id: string): Promise<IAddress[] | undefined> {
    const listAddresses = await this.addressesRepository.findAllAddressesToPerson(
      person_id,
    );

    console.log('Addresses:::', listAddresses);

    // if (listAddresses?.length > 0) return listAddresses;
    return undefined;
  }
}

export default ListAddressesService;
