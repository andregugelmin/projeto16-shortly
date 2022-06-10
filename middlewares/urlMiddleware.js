import db from '../config/db.js';
import urlSchema from '../schemas/urlSchema.js';

export function validateUrl(req, res, next) {
    const { url } = req.body;
    const validation = urlSchema.validate({ url });
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

export async function validateUserUrl(req, res, next) {
    const { id } = req.params;
    const session = res.locals.session;

    try {
        let query = await db.query(
            `SELECT * FROM "shortUrls" 
            WHERE id = $1;`,
            [id]
        );

        if (query.rowCount === 0) return res.sendStatus(404);
        if (query.userId != session.userId) return res.sendStatus(401);
    } catch (e) {
        return res.status(500).send('Could not validate user ' + e);
    }

    next();
}
