import pagarme from 'pagarme';
import { inject, injectable } from 'tsyringe';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';
import IPhonesRepository from '@modules/users/repositories/IPhonesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

import IOrdersRepository from '../repositories/IOrdersRepository';

interface IOrderProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  user_id: string;
  fee: number;
  products: IOrderProduct[];
  card_hash: string;
  installments: string;
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
  fee: number;
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

    @inject('PhonesRepository')
    private phonesRepository: IPhonesRepository,

    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute({
    user_id,
    fee,
    products,
    card_hash,
    installments,
  }: IRequest): Promise<IOrder> {
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
      return totalsum + item.price * item.quantity;
    }, 0);

    const client = await pagarme.client.connect({
      api_key: process.env.PAGARME_API_KEY,
    });

    // busca phone and address

    const phone = await this.phonesRepository.findById(
      userExists.person.phone_id_man,
    );
    const newPhone = `${phone?.prefix} ${phone?.number}`;

    const address = await this.addressesRepository.findById(
      userExists.person.address_id_man,
    );

    const pagarmeTransaction = await client.transactions.create({
      amount: parseInt(String(total + fee), 10),
      card_hash,
      customer: {
        name: userExists.person.name,
        email: userExists.person.email,
        country: 'br',
        type: 'individual',
        documents: [
          {
            type: 'cpf',
            number: userExists.person.cpf,
          },
          {
            type: 'rg',
            number: userExists.person.rg,
          },
        ],
        phone_numbers: [newPhone],
        billing: {
          name: userExists.person.name,
          address: {
            ...address,
            country: 'br',
          },
        },
        shipping: {
          name: userExists.person.name,
          fee,
          delivery_date: '2020-09-11',
          expedited: false,
          address: {
            ...address,
            country: 'br',
          },
        },
        items: serializadProducts.map((item: any) => ({
          id: String(item.id),
          title: item.name,
          unit_price: parseInt(String(item.price * 100), 10),
          quantity: item.quantity,
          tangible: true,
        })),
      },
    });

    console.log('pagarmeTransaction::', pagarmeTransaction);

    const newOrder = await this.ordersRepository.create({
      user: userExists,
      products: serializadProducts,
      total: total + fee,
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

    /*
const transactions = await Transaction.create({
        checkout_id: checkout.id,
        transaction_id: pagarmeTransaction.id,
        status: pagarmeTransaction.status,
        authorized_code: pagarmeTransaction.authorization_code,
        brand: pagarmeTransaction.card.brand,
        authorized_amount: pagarmeTransaction.authorized_amount,
        tid: pagarmeTransaction.tid,
        installments,
      }); */

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
      fee: newOrder.fee,
      total: newOrder.total,
      created_at: newOrder.created_at,
      updated_at: newOrder.updated_at,
    };

    return order;
  }
}

export default CreateOrderService;
