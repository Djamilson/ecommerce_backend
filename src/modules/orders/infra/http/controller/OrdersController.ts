import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FinAllOrderToUserIdService from '@modules/orders/services/FindAllOrderToUserIdService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findOrder = container.resolve(FindOrderService);

    const order = await findOrder.execute({ id });

    return response.json(order);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    console.log('Init...');
    const findOrders = container.resolve(FinAllOrderToUserIdService);

    const orders = await findOrders.execute({ user_id });

    console.log('Finally...');
    return response.json(classToClass(orders));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    // const { user_id, products } = request.body;

    const user_id = request.user.id;
    const { products, fee, card_hash, installments } = request.body;

    const createOrder = container.resolve(CreateOrderService);
    console.log('estou no controller: ', products[0]);
    console.log('products', products);
    const customer = await createOrder.execute({
      user_id,
      fee,
      products,
      card_hash,
      installments,
    });

    console.log('passou:::: final', customer);
    return response.json(customer);
  }
}
