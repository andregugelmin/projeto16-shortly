import db from '../config/db.js';

export async function validToken(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) return res.sendStatus(401);

    const token = authorization?.replace('Bearer ', '');

    if (!token)
        return res.status(401).send({
            message: 'Token not found in data base',
        });

    try {
        const query = await db.query(
            'SELECT * FROM sessions WHERE token = $1;',
            [token]
        );

        if (query.rowCount === 0) return res.sendStatus(401);

        res.locals.session = query;
    } catch (e) {
        return res.status(500).send('Could not valid session ' + e);
    }

    next();
}
