import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, price, image, stock } = req.body;

      const createProduct = container.resolve(CreateProductService);
      // dependencia

      const product = await createProduct.execute({
        name,
        price,
        image,
        stock,
      });

      return res.json(classToClass(product));
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
