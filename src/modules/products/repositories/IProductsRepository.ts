import ICreateProductDTO from '../dtos/ICreateProductDTO';
import IPaginationsDTO from '../dtos/IPaginationsDTO';
import IUpdateProductsQuantityDTO from '../dtos/IUpdateStocksQuantityDTO';
import Product from '../infra/typeorm/entities/Product';

interface IFindProducts {
  id: string;
}

export default interface IProductsRepository {
  findById(id: string): Promise<Product | undefined>;
  findAllById(products: IFindProducts[]): Promise<Product[]>;
  findAll(paginationDTO: IPaginationsDTO): Promise<Product[]>;
  findByName(name: string): Promise<Product | undefined>;
  updateQuantity(products: IUpdateProductsQuantityDTO[]): Promise<Product[]>;
  create(data: ICreateProductDTO): Promise<Product>;
  save(product: Product): Promise<Product>;
}
