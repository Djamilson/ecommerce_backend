import { injectable, inject } from 'tsyringe';

// import AppError from '@shared/errors/AppError';

import Stock from '../infra/typeorm/entities/Stock';
import IStocksRepository from '../repositories/IStocksRepository';

interface IRequest {
  product_id: string;
  amount: number;
}

@injectable()
class CreateStockService {
  constructor(
    @inject('StocksRepository')
    private stocksRepository: IStocksRepository,
  ) {}

  public async execute({ product_id, amount }: IRequest): Promise<Stock> {
    const product = this.stocksRepository.create({
      product_id,
      amount,
    });

    return product;
  }
}

export default CreateStockService;
