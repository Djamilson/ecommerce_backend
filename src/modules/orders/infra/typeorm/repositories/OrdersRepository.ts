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
    const order = this.ormRepository.create({
      user,
      order_products: products,
      total,
      fee,
    });

    await this.ormRepository.save(order);

    return order;
  }

  public async save(order: Order): Promise<Order> {
    console.log('Vou alterar a Order :::', order);
    return this.ormRepository.save(order);
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = this.ormRepository.findOne(id, {
      relations: [
        'order_products',
        'user',
        'user.person',
        'order_products.product',
      ],
    });

    return order;
  }

  public async findAllOrdersToUserId(user_id: string): Promise<Order[]> {
    const orders = this.ormRepository.find({
      where: { user_id },
      order: { created_at: 'DESC' },
      relations: [
        'order_products',
        'user',
        'user.person',
        'order_products.product',
      ],
    });

    return orders;
  }
}

export default OrdersRepository;
