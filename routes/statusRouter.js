import { Router } from 'express';

const statusRouter = Router();

statusRouter.get('/users/:id');
statusRouter.get('/ranking');

export default statusRouter;
