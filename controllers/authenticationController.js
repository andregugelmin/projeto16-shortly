import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
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
        console.error(chalk.bold.red('Could not post signup'), e);
        return res.sendStatus(500);
    }
}

export async function postSignin(req, res) {
    const { id } = res.locals.userId;
    const token = uuid();

    try {
        await db.query(
            `INSERT INTO sessions("userId", token) VALUES ($1, $2)`,
            [id, token]
        );

        res.send({ token }).status(200);
    } catch (e) {
        console.error(chalk.bold.red('Could not post signin'), e);
        return res.sendStatus(500);
    }
}
