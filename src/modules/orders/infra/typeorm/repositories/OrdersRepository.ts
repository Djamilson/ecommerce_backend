import { getRepository, Repository } from 'typeorm';

import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';

import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({
    user,
    products,
    total,
    fee,
  }: ICreateOrderDTO): Promise<Order> {
    console.log('Dentro::: ', user, products, total);
    const order = this.ormRepository.create({
      user,
      order_products: products,
      total,
      fee,
    });

    console.log('Passou::: 1', order);

    await this.ormRepository.save(order);

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = this.ormRepository.findOne(id, {
      relations: ['order_products', 'user', 'user.person'],
    });

    return order;
  }
}

export default OrdersRepository;
