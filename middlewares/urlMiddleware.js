import urlSchema from '../schemas/urlSchema.js';

export function validateUrl(req, res, next) {
    const { url } = req.body;
    const validation = urlSchema.validate(url);
    if (validation.error) {
        return res.status(422).send({
            message: 'Invalid url',
            details: validation.error.details.map((e) => e.message),
        });
    }

    res.locals.url = {
        url: url,
    };

    next();
}
