import { customAlphabet } from 'nanoid/async';
import chalk from 'chalk';

import db from '../config/db.js';

export async function postShortUrl(req, res) {
    const session = res.locals.session;
    const { url } = res.locals.url;

    const shortId = await generateShortId();
    console.log({ shortId });
    try {
        let queryUrl = await db.query(`SELECT * FROM urls WHERE url = $1;`, [
            url,
        ]);

        if (queryUrl.rowCount === 0) {
            await db.query(`INSERT INTO urls( url) VALUES ($1)`, [url]);

            queryUrl = await db.query(`SELECT * FROM urls WHERE url = $1;`, [
                url,
            ]);
        }

        await db.query(
            `INSERT INTO "shortUrls"("urlId", url, "userId", "visitsCount") VALUES ($1, $2, $3, $4)`,
            [queryUrl.rows[0].id, shortId, session.userId, 0]
        );

        return res
            .send({
                shortUrl: shortId,
            })
            .status(201);
    } catch (e) {
        console.error(chalk.bold.red('Could not post short url'), e);
        return res.sendStatus(500);
    }
}

export async function getUrl(req, res) {
    const { id } = req.params;

    try {
        const query = await db.query(
            `SELECT "shortUrls".id, "shortUrls".url as "shortUrl", urls.url FROM "shortUrls" 
            JOIN urls ON "shortUrls"."urlId" = "urls".id 
            WHERE "shortUrls".id = $1`,
            [id]
        );

        if (query.rowCount === 0) {
            return res.sendStatus(404);
        }

        console.log(query.rows[0]);
        return res.status(200).send({ ...query.rows[0] });
    } catch (e) {
        console.error(chalk.bold.red('Could not get url'), e);
        return res.sendStatus(500);
    }
}

export async function redirectToUrl(req, res) {
    const { shortUrl } = req.params;

    try {
        const query = await db.query(
            `SELECT "shortUrls".id, "shortUrls".url as "shortUrl", "shortUrls"."visitsCount", urls.url FROM "shortUrls" 
        JOIN urls ON "shortUrls"."urlId" = "urls".id 
        WHERE "shortUrls".url = $1`,
            [shortUrl]
        );

        if (query.rowCount === 0) {
            return res.sendStatus(404);
        }

        const viewCount = query.rows[0].visitsCount + 1;

        await db.query(
            `UPDATE "shortUrls" SET "visitsCount" = $1 WHERE id = $2;`,
            [viewCount, query.rows[0].id]
        );

        return res.redirect(query.rows[0].url);
    } catch (e) {
        console.error(chalk.bold.red('Could not redirect to url'), e);
        return res.sendStatus(500);
    }
}

export async function deleteUrl(req, res) {
    const { id } = req.params;

    try {
        await db.query(`DELETE FROM "shortUrls" WHERE id = $1;`, [id]);
    } catch (e) {
        console.error(chalk.bold.red('Could not delete url'), e);
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
