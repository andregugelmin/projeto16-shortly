import { Router } from 'express';
import {
    postSignin,
    postSignup,
} from '../controllers/authenticationController.js';
import {
    validateSignin,
    validateSignup,
} from '../middlewares/authenticationMiddleware.js';

const authenticationRouter = Router();

authenticationRouter.post('/singup', validateSignup, postSignup);
authenticationRouter.post('/signin', validateSignin, postSignin);

export default authenticationRouter;
