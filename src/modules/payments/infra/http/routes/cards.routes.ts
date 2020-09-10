import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticanted';

import CardsController from '../controllers/CardsController';

const cardsRouter = Router();
const cardsController = new CardsController();

cardsRouter.use(ensureAuthenticated);

cardsRouter.get('/', cardsController.index);

export default cardsRouter;
