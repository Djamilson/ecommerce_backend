import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticanted';

import CheckoutsController from '../controllers/CheckoutsController';

const checkoutsRouter = Router();
const checkoutsController = new CheckoutsController();

checkoutsRouter.use(ensureAuthenticated);

checkoutsRouter.post('/', checkoutsController.index);

export default checkoutsRouter;
