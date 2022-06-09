import { Router } from 'express';
import { postSignup } from '../controllers/authenticationController.js';
import { validateSignup } from '../middlewares/authenticationMiddleware.js';

const authenticationRouter = Router();

authenticationRouter.post('/singup', validateSignup, postSignup);
authenticationRouter.post('/signin');

export default authenticationRouter;
