import express from 'express';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itensController = new ItemsController();

routes.get('/items', itensController.index);

routes.post(
    '/point', 
    upload.single('image'), 
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.string().required().length(11),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().length(2),
            items: Joi.string().required()
        })
    }, {
        abortEarly: false
    }),
    pointsController.create);


routes.get('/point', pointsController.index);
routes.get('/point/:id', pointsController.show);

export default routes;