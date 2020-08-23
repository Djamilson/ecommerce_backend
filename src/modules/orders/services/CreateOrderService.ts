import { inject, injectable } from 'tsyringe';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IOrderProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  user_id: string;
  products: IOrderProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, products }: IRequest): Promise<Order> {
    console.log('1');
    const userExists = await this.usersRepository.findById(user_id);
    console.log('12');
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

    console.log('cheguei no 6');

    const findProductsWithNoQuantity = products.filter(
      product =>
        existentProducts.filter(p => p.id === product.id)[0].stock <
        product.quantity,
    );

    console.log('cheguei no 7');
    if (findProductsWithNoQuantity.length) {
      throw new AppError(
        `The quantity ${findProductsWithNoQuantity[0].quantity} is not available for ${findProductsWithNoQuantity[0].id} `,
      );
    }

    console.log('meu product:::', existentProducts);

    const serializadProducts = products.map(order_product => {
      console.log('meu order_product:::', order_product);
      return {
        product_id: order_product.id,
        quantity: order_product.quantity,
        price: existentProducts.filter(p => p.id === order_product.id)[0].price,
      };
    });

    console.log('cheguei no 7 serializadProducts', serializadProducts);

    const order = await this.ordersRepository.create({
      user: userExists,
      products: serializadProducts,
    });

    console.log('cheguei no 116');

    const { order_products } = order;

    const orderedProductsQuantity = order_products.map(product => ({
      id: product.product_id,
      stock:
        existentProducts.filter(p => p.id === product.product_id)[0].stock -
        product.quantity,
    }));

    await this.productsRepository.updateQuantity(orderedProductsQuantity);

    return order;
  }
}

export default CreateOrderService;
