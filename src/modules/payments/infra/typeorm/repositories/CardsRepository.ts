import { getRepository, Repository } from 'typeorm';

import ICardsRepository from '@modules/payments/repositories/ICardsRepository';

import CreditCard from '../entities/CreditCard';

class CardsRepository implements ICardsRepository {
  private ormRepository: Repository<CreditCard>;

  constructor() {
    this.ormRepository = getRepository(CreditCard);
  }

  public async findAllCard(): Promise<CreditCard[]> {
    const existsCards = await this.ormRepository.find();

    return existsCards;
  }
}

export default CardsRepository;
