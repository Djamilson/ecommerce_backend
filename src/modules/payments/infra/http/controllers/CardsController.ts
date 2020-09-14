import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListCardsService from '@modules/payments/services/ListCardsService';

export default class CardsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const listCards = container.resolve(ListCardsService);

    const cards = await listCards.execute();

    return res.json(classToClass(cards));
  }
}
