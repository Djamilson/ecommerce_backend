import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSectionService from '@modules/products/services/CreateSectionService';

export default class SectionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name } = req.body;

      console.log('name:', name);
      const createSection = container.resolve(CreateSectionService);
      // dependencia

      const product = await createSection.execute({
        name,
      });

      return res.json(classToClass(product));
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
