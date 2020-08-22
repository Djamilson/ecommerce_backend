import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateProductService from '@modules/products/services/CreateProductService';
import CreateStockService from '@modules/products/services/CreateStockService';

export default class ProductController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { title, price, image, amount } = req.body;

      const createProduct = container.resolve(CreateProductService);
      // dependencia
      const createStock = container.resolve(CreateStockService);

      const product = await createProduct.execute({ title, price, image });

      await createStock.execute({ product_id: product.id, amount });

      return res.json(classToClass(product));
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
