import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticanted';

import SectionsController from '../controllers/SectionsController';

const sectionsRouter = Router();
const sectionsController = new SectionsController();

sectionsRouter.use(ensureAuthenticated);

sectionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  sectionsController.create,
);

export default sectionsRouter;
