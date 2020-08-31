import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateProductService from '@modules/products/services/CreateProductService';
import FindProductService from '@modules/products/services/FindProductService';
import ListProductsService from '@modules/products/services/ListProductsService';

export default class ProductsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findProduct = container.resolve(FindProductService);

    const product = await findProduct.execute({ id });

    return response.json(product);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { page, limit } = req.body;

    const listProducts = container.resolve(ListProductsService);

    const products = await listProducts.execute({
      page,
      limit,
    });

    return res.json(classToClass(products));
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, price, image, stock, section_id } = req.body;

      const createProduct = container.resolve(CreateProductService);
      // dependencia

      const product = await createProduct.execute({
        name,
        price,
        image,
        stock,
        section_id,
      });

      return res.json(classToClass(product));
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
