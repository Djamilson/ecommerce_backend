import { inject, injectable } from 'tsyringe';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  id: string;
}

@injectable()
class FindProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Product | undefined> {
    const product = await this.productsRepository.findById(id);

    return product;
  }
}

export default FindProductService;
