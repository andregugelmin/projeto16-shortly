import { Router } from 'express';
import { getRanking, getUser } from '../controllers/statusController.js';
import { validToken } from '../middlewares/tokenValidationMiddleware.js';

const statusRouter = Router();

statusRouter.get('/users/:id', validToken, getUser);
statusRouter.get('/ranking', getRanking);

export default statusRouter;
