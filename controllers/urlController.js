import { customAlphabet } from 'nanoid/async';
import chalk from 'chalk';

import db from '../config/db.js';

export async function postShortUrl(req, res) {
    const session = res.locals.session;
    const { url } = res.locals.url;

    const shortId = generateShortId();

    try {
        let queryUrl = await db.query('SELECT * FROM urls WHERE url = $1;', [
            url,
        ]);

        if (queryUrl.rowCount === 0) {
            queryUrl = await db.query(`INSERT INTO urls( url) VALUES ($1)`, [
                url,
            ]);
        }

        await db.query(
            `INSERT INTO "shortUrls"(urlId, url, userId, visitsCount) VALUES ($1, $2, $3, $4)`,
            [queryUrl.id, shortId, session.id, 0]
        );

        res.send({
            shortUrl: shortId,
        }).status(201);
    } catch (e) {
        console.error(chalk.bold.red('Could not post short url'), e);
        return res.sendStatus(500);
    }
}

async function generateShortId() {
    const nanoid = customAlphabet('1234567890abcdef', 8);

    try {
        let shortId = await nanoid();

        let query = await db.query(
            'SELECT * FROM "shortUrls" WHERE url = $1;',
            [shortId]
        );

        while (query.rowCount != 0) {
            shortId = await nanoid();

            query = await db.query(
                'SELECT * FROM "shortUrls" WHERE url = $1;',
                [shortId]
            );
        }

        return shortId;
    } catch (e) {
        console.error(chalk.bold.red('Could not generate short id'), e);
    }
}
