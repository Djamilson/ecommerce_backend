import { inject, injectable } from 'tsyringe';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

import IOrdersRepository from '../repositories/IOrdersRepository';

interface IOrderProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  user_id: string;
  products: IOrderProduct[];
}

interface IOrderProduct {
  product_id: string;
  price: number;
  quantity: number;
  order_id: string;
  id: string;
  created_at: Date;
  updated_at: Date;
}

interface IOrder {
  user: {
    id: string;
    person: {
      id: string;
      name: string;
      email: string;
      status: boolean;
      privacy: boolean;
      avatar: string;
      address_id_man: string;
      phone_id_man: string;
    };
  };
  order_products: IOrderProduct[];
  total: number;
  id: string;
  created_at: Date;
  updated_at: Date;
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

  public async execute({ user_id, products }: IRequest): Promise<IOrder> {
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
        existentProducts.filter(p => p.id === product.id)[0].stock <
        product.quantity,
    );

    if (findProductsWithNoQuantity.length) {
      throw new AppError(
        `The quantity ${findProductsWithNoQuantity[0].quantity} is not available for ${findProductsWithNoQuantity[0].id} `,
      );
    }

    const serializadProducts = products.map(order_product => {
      const oldPrice = existentProducts.filter(
        p => p.id === order_product.id,
      )[0].price;

      return {
        subtotal: oldPrice * order_product.quantity,
        product_id: order_product.id,
        quantity: order_product.quantity,
        price: oldPrice,
      };
    });

    const total = serializadProducts.reduce((totalsum, item) => {
      console.log('estou somando::', totalsum, item);

      return totalsum + item.price * item.quantity;
    }, 0);

    const newOrder = await this.ordersRepository.create({
      user: userExists,
      products: serializadProducts,
      total,
    });

    const { order_products } = newOrder;

    const orderedProductsQuantity = order_products.map(product => ({
      id: product.product_id,
      stock:
        existentProducts.filter(p => p.id === product.product_id)[0].stock -
        product.quantity,
    }));

    await this.productsRepository.updateQuantity(orderedProductsQuantity);

    const order_productIds = order_products.map(
      (ord_product: IOrderProduct) => {
        return { id: ord_product.product_id };
      },
    );

    const myProducts = await this.productsRepository.findAllById(
      order_productIds,
    );

    const products_to_names = order_products.map(ordersProducts => {
      return {
        ...ordersProducts,
        name: myProducts.filter((prod: Product) => {
          if (prod.id === ordersProducts.product_id) {
            return prod.name;
          }
        })[0].name,
      };
    });

    const order = {
      user: {
        id: newOrder.user.id,
        person: {
          id: newOrder.user.person.id,
          name: newOrder.user.person.name,
          email: newOrder.user.person.email,
          status: newOrder.user.person.status,
          privacy: newOrder.user.person.privacy,
          avatar: newOrder.user.person.avatar,
          address_id_man: newOrder.user.person.address_id_man,
          phone_id_man: newOrder.user.person.phone_id_man,
        },
      },
      order_products: [...products_to_names],
      id: newOrder.id,
      total: newOrder.total,
      created_at: newOrder.created_at,
      updated_at: newOrder.updated_at,
    };

    return order;
  }
}

export default CreateOrderService;
