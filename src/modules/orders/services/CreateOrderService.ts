import { format } from 'date-fns';
import pagarme from 'pagarme';
import { inject, injectable } from 'tsyringe';

import ITransactionsRepository from '@modules/payments/repositories/ITransactionsRepository';
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

interface IProduct {
  itemProduct: {
    stock: number;
    product: {
      id: string;
      name: string;
      stock: number;
      price: number;
    };
  };
}
interface IRequest {
  user_id: string;
  fee: number;
  products: IProduct[];
  card_hash: string;
  installments: string;
}

interface IOrderProduct {
  id: string;
  product_id: string;
  order_id: string;
  price: number;
  quantity: number;
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

    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
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
      product => !productExistsIds.includes(product.itemProduct.product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].itemProduct.product.id}`,
      );
    }

    const findProductsWithNoQuantity = products.filter(item => {
      return (
        existentProducts.filter(p => p.id === item.itemProduct.product.id)[0]
          .stock < item.itemProduct.stock
      );
    });

    if (findProductsWithNoQuantity.length) {
      throw new AppError(
        `The quantity ${findProductsWithNoQuantity[0].itemProduct.product.stock}
        is not available for
        ${findProductsWithNoQuantity[0].itemProduct.product.id} `,
      );
    }

    const serializadProducts = products.map(order_product => {
      const oldPrice = existentProducts.filter(
        p => p.id === order_product.itemProduct.product.id,
      )[0].price;

      return {
        name: order_product.itemProduct.product.name,
        subtotal: oldPrice * order_product.itemProduct.stock,
        product_id: order_product.itemProduct.product.id,
        quantity: order_product.itemProduct.stock,
        price: oldPrice,
      };
    });

    const total = serializadProducts.reduce((totalsum, item) => {
      return totalsum + item.price * item.quantity;
    }, 0);

    console.log('Init pagarme');
    const client = await pagarme.client.connect({
      api_key: process.env.PAGARME_API_KEY,
    });

    // busca phone and address

    const phone = await this.phonesRepository.findById(
      userExists.person.phone_id_man,
    );

    const newPhone = `${phone?.prefix}${phone?.number}`.replace(
      /([^0-9])/g,
      '',
    );

    const address = await this.addressesRepository.findById(
      userExists.person.address_id_man,
    );

    const pagarmeTransaction = await client.transactions.create({
      api_key: process.env.PAGARME_API_KEY,
      capture: 'false',
      amount: 21000,
      card_hash,
      customer: {
        external_id: userExists.id,
        name: userExists.person.name,
        email: userExists.person.email,
        type: 'individual',
        country: 'br',

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
        phone_numbers: [`+55${newPhone}`],
        birthday: format(userExists.person.birdth_date, 'yyyy-MM-dd'),
      },
      billing: {
        name: userExists.person.name,
        address: {
          country: 'br',
          state: address?.city.state.name,
          city: address?.city.name,
          neighborhood: address?.neighborhood,
          street: address?.street,
          street_number: `${address?.number}`.replace(/([^0-9])/g, ''),
          zipcode: `${address?.zip_code}`.replace(/([^0-9])/g, ''),
        },
      },
      shipping: {
        name: userExists.person.name,
        fee,
        expedited: true,
        address: {
          country: 'br',
          state: address?.city.state.name,
          city: address?.city.name,
          neighborhood: address?.neighborhood,
          street: address?.street,
          street_number: `${address?.number}`.replace(/([^0-9])/g, ''),
          zipcode: `${address?.zip_code}`.replace(/([^0-9])/g, ''),
        },
      },
      items: serializadProducts.map((item: any) => ({
        id: String(item.product_id),
        title: item.name,
        unit_price: parseInt(String(item.price * 100), 10),
        quantity: item.quantity,
        tangible: true,
      })),
    });

    const newOrder = await this.ordersRepository.create({
      user: userExists,
      products: serializadProducts,
      total: total + fee,
      fee,
    });
    console.log('newOrder', newOrder);

    const { id: order_id, order_products } = newOrder;

    const orderedProductsQuantity = order_products.map(product => ({
      id: product.product_id,
      stock:
        existentProducts.filter(p => p.id === product.product_id)[0].stock -
        product.quantity,
    }));

    await this.productsRepository.updateQuantity(orderedProductsQuantity);

    const order_productIds = order_products.map(
      (ord_product: IOrderProduct) => {
        return {
          itemProduct: {
            stock: 0,
            product: {
              id: ord_product.product_id,
              name: '',
              price: 0,
            },
          },
        };
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

    const {
      id: transaction_id,
      status,
      authorization_code,
      card_brand: brand,
      authorized_amount,
      tid,
    } = pagarmeTransaction;

    console.log(
      'Finalizando Transatc>>> ',
      transaction_id,
      status,
      authorization_code,
      brand,
      authorized_amount,
      tid,
    );

    console.log('Finalizando Transatc>>> ', pagarmeTransaction);

    const newTransaction = await this.transactionsRepository.create({
      transaction_id,
      status,
      authorization_code,
      authorized_amount,
      brand,
      tid,
      installments,
      order_id,
    });

    console.log('passou da create Transaction: ', newTransaction);

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
