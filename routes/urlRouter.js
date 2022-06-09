import { Router } from 'express';
import { postShortUrl } from '../controllers/urlController.js';
import { validateUrl } from '../middlewares/urlMiddleware.js';

const urlRouter = Router();

urlRouter.post('/urls/shorten', validateUrl, postShortUrl);
urlRouter.get('/urls/:id');
urlRouter.get('/urls/open/:shortUrl');
urlRouter.delete('/urls/:id');

export default urlRouter;
