import chalk from 'chalk';

import db from '../config/db.js';

export async function getUser(req, res) {
    const session = res.locals.session;
    const { id } = req.params;

    if (session.id != id) return res.sendStatus(401);

    try {
        const userQuery = await db.query(
            `SELECT u.id, u.name, SUM(s."visitsCount") as "visitCount"
            FROM users u
            JOIN "shortUrls" s ON u.id = s."userId"
            WHERE u.id = $1
            GROUP BY u.id`,
            [id]
        );

        const shortUrlsQuery = await db.query(
            `SELECT s.id, s.url, u.url, s."visitsCount"
            FROM "shortUrls" s
            JOIN url u ON u.id = s."urlId"
            JOIN users us ON us.id = s."userId"
            WHERE us.id = $1
            GROUP BY s.id
            `,
            [id]
        );

        res.status(200).send({
            ...userQuery.rows[0],
            shortenedUrls: shortUrlsQuery.rows,
        });
    } catch (e) {
        console.error(chalk.bold.red('Could not get user'), e);
        return res.sendStatus(500);
    }
}

export async function getRanking(req, res) {
    try {
        const query = await db.query(
            `SELECT u.id, u.name, COUNT(s.id) as "linksCount", SUM(s."visitsCount") as "visitCount"
            FROM users u
            LEFT JOIN "shortUrls" s ON u.id = s."usersId"
            GROUP BY u.id
            COUNT BY "visitCount" DESC
            LIMIT 10
            `
        );

        res.status(200).send(query.rows);
    } catch (e) {
        console.error(chalk.bold.red('Could not get ranking'), e);
        return res.sendStatus(500);
    }
}
