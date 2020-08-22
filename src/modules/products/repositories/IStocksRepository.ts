import ICreateStockDTO from '../dtos/ICreateStockDTO';
import IUpdateStocksQuantityDTO from '../dtos/IUpdateStocksQuantityDTO';
import Stock from '../infra/typeorm/entities/Stock';

export default interface IStocksRepository {
  findByStockProductId(product_id: string): Promise<Stock | undefined>;
  create(data: ICreateStockDTO): Promise<Stock>;
  save(stock: Stock): Promise<Stock>;
  updateQuantity(stocks: IUpdateStocksQuantityDTO[]): Promise<Stock[]>;
}
