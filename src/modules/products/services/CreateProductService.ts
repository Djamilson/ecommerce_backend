import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  title: string;
  price: number;
  image: string;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ title, price, image }: IRequest): Promise<Product> {
    const productExists = await this.productsRepository.findByTitle(title);

    if (productExists) {
      throw new AppError('There is already one product with this name');
    }

    const product = this.productsRepository.create({
      title,
      image,
      price,
    });

    return product;
  }
}

export default CreateProductService;
