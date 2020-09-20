import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticanted';

import FeesController from '../controller/FeesController';
import ZipCodeController from '../controller/SearcherZipCodeController';

const feesRouter = Router();
const feesController = new FeesController();
const zipCodeController = new ZipCodeController();

feesRouter.use(ensureAuthenticated);

feesRouter.get('/:cep', feesController.show);
feesRouter.get('/searcher/:cep', zipCodeController.show);

export default feesRouter;
