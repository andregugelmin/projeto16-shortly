import bcrypt from 'bcrypt';
import chalk from 'chalk';

import db from '../config/db.js';
import { signInSchema, signUpSchema } from '../schemas/authenticationSchema.js';

export async function validateSignup(req, res, next) {
    const user = req.body;
    const validation = signUpSchema.validate(user);
    if (validation.error) {
        return res.status(422).send({
            message: 'Invalid sign up',
            details: validation.error.details.map((e) => e.message),
        });
    }

    try {
        const query = await db.query('SELECT * FROM users WHERE email = $1;', [
            user.email,
        ]);

        if (query.rowCount > 0)
            return res.status(400).send({
                message: 'Email already exists',
            });
    } catch (e) {
        console.error(chalk.bold.red('Could not validate singup'), e);
        return res.sendStatus(500);
    }

    res.locals.user = {
        name: user.name,
        email: user.email,
        password: user.password,
    };

    next();
}

export async function validateSignin(req, res, next) {
    const user = req.body;

    const validation = signInSchema.validate(user);

    let id = 0;

    if (validation.error) {
        return res.status(422).send({
            message: 'Invalid sign in',
            details: validation.error.details.map((e) => e.message),
        });
    }

    try {
        const query = await db.query('SELECT * FROM users WHERE email = $1;', [
            user.email,
        ]);
        if (
            query.rowCount === 0 ||
            !bcrypt.compareSync(user.password, query.rows[0].password)
        ) {
            return res.sendStatus(401);
        }

        id = query.rows[0].id;
    } catch (e) {
        console.error(chalk.bold.red('Could not validate signin'), e);
        return res.sendStatus(500);
    }

    res.locals.userId = {
        id: id,
    };

    next();
}
