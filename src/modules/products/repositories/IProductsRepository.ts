import ICreateProductDTO from '../dtos/ICreateProductDTO';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';
import IUpdateProductsQuantityDTO from '../dtos/IUpdateStocksQuantityDTO';
import Product from '../infra/typeorm/entities/Product';

interface IFindProducts {
  id: string;
}

export default interface IProductsRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<Product[]>;
  findById(id: string): Promise<Product | undefined>;
  findAllById(products: IFindProducts[]): Promise<Product[]>;
  findByName(name: string): Promise<Product | undefined>;
  updateQuantity(products: IUpdateProductsQuantityDTO[]): Promise<Product[]>;
  create(data: ICreateProductDTO): Promise<Product>;
  save(product: Product): Promise<Product>;
}