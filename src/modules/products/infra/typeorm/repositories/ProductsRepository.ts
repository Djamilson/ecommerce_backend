import { getRepository, Repository, Not } from 'typeorm';

import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IFindAllProvidersDTO from '@modules/products/dtos/IFindAllProvidersDTO';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';

import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const existsProducts = await this.ormRepository.find({
      where: {
        id: In(productIds),
      },
    });

    return existsProducts;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne(id);
    return product;
  }

  public async findByTitle(title: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { title },
    });

    return product;
  }

  public async findAllProviders({
    except_product_id,
  }: IFindAllProvidersDTO): Promise<Product[]> {
    let products: Product[];

    if (except_product_id) {
      products = await this.ormRepository.find({
        where: {
          id: Not(except_product_id),
        },
      });
    } else {
      products = await this.ormRepository.find();
    }

    return products;
  }

  public async create(productData: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create(productData);
    await this.ormRepository.save(product);
    return product;
  }

  public async save(product: Product): Promise<Product> {
    return this.ormRepository.save(product);
  }
}

export default ProductsRepository;
