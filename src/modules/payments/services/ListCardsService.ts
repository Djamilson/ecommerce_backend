import { inject, injectable } from 'tsyringe';

import ICardsRepository from '../repositories/ICardsRepository';

interface IRequest {
  card_id: string;
  number: string;
  holder_name: string;
  expiration_date: string;
  brand: string;
}

@injectable()
class ListCardsService {
  constructor(
    @inject('CardsRepository')
    private cardsRepository: ICardsRepository,
  ) {}

  public async execute(): Promise<IRequest[]> {
    const cards = await this.cardsRepository.findAllCard();

    return cards;
  }
}

export default ListCardsService;
