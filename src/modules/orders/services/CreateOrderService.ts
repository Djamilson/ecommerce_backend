import { inject, injectable } from 'tsyringe';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IStocksRepository from '@modules/products/repositories/IStocksRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IStock {
  id: string;
  amount: number;
}

interface IProduct {
  id: string;
  stock: IStock;
}

interface IRequest {
  user_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('StocksRepository')
    private stocksRepository: IStocksRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, products }: IRequest): Promise<Order> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError('There not find any user with the givan id');
    }
    const existentProducts = await this.productsRepository.findAllById(
      products,
    );

    if (!existentProducts.length) {
      throw new AppError('Could not find product with the ids');
    }

    const productExistsIds = existentProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !productExistsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}`,
      );
    }

    const findProductsWithNoQuantity = products.filter(
      product =>
        existentProducts.filter(p => p.id === product.id)[0].stock.amount <
        product.stock.amount,
    );

    if (findProductsWithNoQuantity.length) {
      throw new AppError(
        `The quantity ${findProductsWithNoQuantity[0].stock.amount} is not available for ${findProductsWithNoQuantity[0].id} `,
      );
    }

    const serializadProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.stock.amount,
      price: existentProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      user: userExists,
      products: serializadProducts,
    });

    const { order_products } = order;

    const orderedProductsQuantity = order_products.map(product => ({
      id: product.product.stock.id,
      amount:
        existentProducts.filter(p => p.id === product.product_id)[0].stock
          .amount - product.quantity,
    }));

    await this.stocksRepository.updateQuantity(orderedProductsQuantity);

    return order;
  }
}

export default CreateOrderService;
