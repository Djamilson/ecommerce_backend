import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  image: string;
  stock: number;
  section_id: string;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    name,
    price,
    image,
    stock,
    section_id,
  }: IRequest): Promise<Product> {
    console.log('productExists: 1 ');
    const productExists = await this.productsRepository.findByName(name);
    console.log('productExists: 2', productExists);
    if (productExists) {
      throw new AppError('There is already one product with this name');
    }

    const product = this.productsRepository.create({
      name,
      image,
      price,
      stock,
      section_id,
    });

    return product;
  }
}

export default CreateProductService;
