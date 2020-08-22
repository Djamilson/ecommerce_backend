import { getRepository, Repository } from 'typeorm';

import ICreateStockDTO from '@modules/products/dtos/ICreateStockDTO';
import IUpdateStocksQuantityDTO from '@modules/products/dtos/IUpdateStocksQuantityDTO';
import IStocksRepository from '@modules/products/repositories/IStocksRepository';

import Stock from '../entities/Stock';

class StocksRepository implements IStocksRepository {
  private ormRepository: Repository<Stock>;

  constructor() {
    this.ormRepository = getRepository(Stock);
  }

  public async findByStockProductId(
    product_id: string,
  ): Promise<Stock | undefined> {
    const stock = await this.ormRepository.findOne({
      where: { product_id },
    });

    return stock;
  }

  public async updateQuantity(
    stocks: IUpdateStocksQuantityDTO[],
  ): Promise<Stock[]> {
    return this.ormRepository.save(stocks);
  }

  public async create(stockData: ICreateStockDTO): Promise<Stock> {
    const stockProduct = this.ormRepository.create(stockData);
    await this.ormRepository.save(stockProduct);
    return stockProduct;
  }

  public async save(stock: Stock): Promise<Stock> {
    return this.ormRepository.save(stock);
  }
}

export default StocksRepository;
