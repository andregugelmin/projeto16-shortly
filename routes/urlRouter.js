import { Router } from 'express';
import {
    deleteUrl,
    getUrl,
    postShortUrl,
    redirectToUrl,
} from '../controllers/urlController.js';
import { validToken } from '../middlewares/tokenValidationMiddleware.js';
import { validateUrl, validateUserUrl } from '../middlewares/urlMiddleware.js';

const urlRouter = Router();

urlRouter.post('/urls/shorten', validToken, validateUrl, postShortUrl);
urlRouter.get('/urls/:id', getUrl);
urlRouter.get('/urls/open/:shortUrl', redirectToUrl);
urlRouter.delete('/urls/:id', validToken, validateUserUrl, deleteUrl);

export default urlRouter;
