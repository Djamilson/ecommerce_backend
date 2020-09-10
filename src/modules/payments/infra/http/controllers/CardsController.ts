import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListCardsService from '@modules/payment/services/ListCardsService';

export default class CardsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { page, limit } = req.body;

    const listCards = container.resolve(ListCardsService);

    const cards = await listCards.execute({
      page,
      limit,
    });

    return res.json(classToClass(cards));
  }
}
