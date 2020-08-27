import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findOrder = container.resolve(FindOrderService);

    const order = await findOrder.execute({ id });

    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    // const { user_id, products } = request.body;

    const user_id = request.user.id;
    const { products } = request.body;

    console.log('iuser_id', user_id);
    const createOrder = container.resolve(CreateOrderService);

    const customer = await createOrder.execute({
      user_id,
      products,
    });

    
    return response.json(customer);
  }
}
