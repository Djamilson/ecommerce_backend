import { Router } from 'express';

import ordersRouter from '@modules/orders/infra/http/routes/orders.routes';
import productsRouter from '@modules/products/infra/http/routes/products.routes';
import sectionsRouter from '@modules/products/infra/http/routes/sections.routes';
import groupsRouter from '@modules/users/infra/http/routes/groups.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use('/groups', groupsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

routes.use('/sections', sectionsRouter);
routes.use('/products', productsRouter);
routes.use('/orders', ordersRouter);

export default routes;
