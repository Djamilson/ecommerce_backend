import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListCitiesService from '@modules/users/services/ListCitiesService';

export default class AddressesController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { state_id } = req.params;

    const listCities = container.resolve(ListCitiesService);

    const products = await listCities.execute({ state_id });

    return res.json(classToClass(products));
  }
}
