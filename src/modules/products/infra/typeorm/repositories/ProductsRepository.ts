import { getRepository, Repository, In, Like } from 'typeorm';

import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IPaginationsDTO from '@modules/products/dtos/IPaginationsDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateStocksQuantityDTO';
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

  public async findAll(paginationDTO: IPaginationsDTO): Promise<Product[]> {
    const keyword = 'a';
    const products = await this.ormRepository.find({
      where: { name: Like(`%${keyword}%`) },
      order: { name: 'DESC' },
      ...paginationDTO,
    });

    return products;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne(id);
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { name },
    });

    return product;
  }

  public async create(productData: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create(productData);
    await this.ormRepository.save(product);

    return product;
  }

  public async save(product: Product): Promise<Product> {
    return this.ormRepository.save(product);
  }

  async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    return this.ormRepository.save(products);
  }
}

export default ProductsRepository;
