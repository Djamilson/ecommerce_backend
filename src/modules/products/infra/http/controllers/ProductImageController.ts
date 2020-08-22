import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProductImageService from '@modules/products/services/UpdateProductImageService';

export default class ProductImageController {
  public async update(req: Request, res: Response): Promise<Response> {
    const updateProductImage = container.resolve(UpdateProductImageService);

    console.log('Dados da Image:', req.user.id, req.file.filename);

    const user = await updateProductImage.execute({
      product_id: req.user.id,
      imageFilename: req.file.filename,
    });

    return res.json(classToClass(user));
  }
}
