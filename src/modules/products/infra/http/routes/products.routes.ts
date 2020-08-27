import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticanted';

import uploadConfig from '@config/upload';

import ProductImageController from '../controllers/ProductImageController';
import ProductsController from '../controllers/ProductsController';

const productsRouter = Router();
const productsController = new ProductsController();
const productImageController = new ProductImageController();

const upload = multer(uploadConfig.multer);

productsRouter.use(ensureAuthenticated);

productsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().required(),
      image: Joi.string().required(),
      stock: Joi.number().required(),
      section_id: Joi.string().required(),
    },
  }),
  productsController.create,
);

productsRouter.patch(
  '/image',
  upload.single('file'),
  productImageController.update,
);

export default productsRouter;
