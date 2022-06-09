import bcrypt from 'bcrypt';
import chalk from 'chalk';

import db from '../config/db.js';

export async function postSignup(req, res) {
    const user = res.locals.user;
    const { name, email } = user;
    const passwordHash = bcrypt.hashSync(user.password, 10);

    try {
        await db.query(
            `INSERT INTO users(name, email, password) VALUES ($1, $2, $3)`,
            [name, email, passwordHash]
        );
        res.sendStatus(201); // created
    } catch (e) {
        console.error(chalk.bold.red('Could not post category'), e);
        return res.sendStatus(500);
    }
}
