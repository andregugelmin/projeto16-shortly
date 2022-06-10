import { Router } from 'express';
import authenticationRouter from './authenticationRouter.js';
import statusRouter from './statusRouter';
import urlRouter from './urlRouter.js';

const router = Router();

router.use(authenticationRouter); // create
router.use(urlRouter); // create/read/update/delete
router.use(statusRouter); // read

export default router;
