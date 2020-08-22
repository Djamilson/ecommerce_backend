import ICreateProductDTO from '../dtos/ICreateProductDTO';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';
import Product from '../infra/typeorm/entities/Product';

interface IFindProducts {
  id: string;
}

export default interface IProductsRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<Product[]>;
  findById(id: string): Promise<Product | undefined>;
  findAllById(products: IFindProducts[]): Promise<Product[]>;
  findByTitle(title: string): Promise<Product | undefined>;
  create(data: ICreateProductDTO): Promise<Product>;
  save(product: Product): Promise<Product>;
}
