import { Router } from 'express';

const authenticationRouter = Router();

authenticationRouter.post('/singup');
authenticationRouter.post('/signin');

export default authenticationRouter;
