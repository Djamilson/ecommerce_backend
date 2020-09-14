import { Router } from 'express';

import ordersRouter from '@modules/orders/infra/http/routes/orders.routes';
import productsRouter from '@modules/products/infra/http/routes/products.routes';
import sectionsRouter from '@modules/products/infra/http/routes/sections.routes';
import addressesRouter from '@modules/users/infra/http/routes/addresses.routes';
import citiesRouter from '@modules/users/infra/http/routes/cities.routes';
import groupsRouter from '@modules/users/infra/http/routes/groups.routes';
import infoClientsRouter from '@modules/users/infra/http/routes/infoclients.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import phonesRouter from '@modules/users/infra/http/routes/phones.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import statesRouter from '@modules/users/infra/http/routes/states.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/groups', groupsRouter);

routes.use('/infoclients', infoClientsRouter);
routes.use('/addresses', addressesRouter);
routes.use('/phones', phonesRouter);

routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

routes.use('/sections', sectionsRouter);
routes.use('/products', productsRouter);
routes.use('/orders', ordersRouter);

routes.use('/cities', citiesRouter);
routes.use('/states', statesRouter);

export default routes;
