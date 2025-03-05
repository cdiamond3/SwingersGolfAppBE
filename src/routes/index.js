import { Router } from 'express';
import { Controller } from '../controllers/index';

const router = Router();
const controller = new Controller();

function setRoutes(app) {
    router.get('/items', controller.getAll.bind(controller));
    router.get('/items/:id', controller.getById.bind(controller));
    // Add more routes as needed

    app.use('/api', router);
}

export default setRoutes;