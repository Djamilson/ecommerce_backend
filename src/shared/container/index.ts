import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import SectionsRepository from '@modules/products/infra/typeorm/repositories/SectionsRepository';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ISectionsRepository from '@modules/products/repositories/ISectionsRepository';
import AddressesRepository from '@modules/users/infra/typeorm/repositories/AddressesRepository';
import GroupsRepository from '@modules/users/infra/typeorm/repositories/GroupsRepository';
import PhonesRepository from '@modules/users/infra/typeorm/repositories/PhonesRepository';
import UsersGroupsRepository from '@modules/users/infra/typeorm/repositories/UsersGroupsRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';
import IGroupsRepository from '@modules/users/repositories/IGroupsRepository';
import IPhonesRepository from '@modules/users/repositories/IPhonesRepository';
import IUsersGroupsRepository from '@modules/users/repositories/IUsersGroupsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  AddressesRepository,
);

container.registerSingleton<IPhonesRepository>(
  'PhonesRepository',
  PhonesRepository,
);

container.registerSingleton<ISectionsRepository>(
  'SectionsRepository',
  SectionsRepository,
);

container.registerSingleton<IUsersGroupsRepository>(
  'UsersGroupsRepository',
  UsersGroupsRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository,
);

container.registerSingleton<IGroupsRepository>(
  'GroupsRepository',
  GroupsRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
