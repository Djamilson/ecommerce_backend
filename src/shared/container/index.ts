import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import StocksRepository from '@modules/products/infra/typeorm/repositories/StocksRepository';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IStocksRepository from '@modules/products/repositories/IStocksRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<IStocksRepository>(
  'StocksRepository',
  StocksRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
