import bcrypt from 'bcrypt';
import chalk from 'chalk';

import db from '../config/db.js';
import { signInSchema, signUpSchema } from '../schemas/authenticationSchema.js';

export function validateSignup(req, res, next) {
    const user = req.body;
    const validation = signUpSchema.validate(user);
    if (validation.error) {
        return res.status(422).send({
            message: 'Invalid sign up',
            details: validation.error.details.map((e) => e.message),
        });
    }

    res.locals.user = {
        name: user.name,
        email: user.email,
        password: user.password,
    };

    next();
}

export function validateSignin(req, res, next) {
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
        const query = db.query('SELECT * FROM users WHERE email = $1;', [
            user.email,
        ]);
        if (
            query.rowCount === 0 ||
            !bcrypt.compareSync(user.password, query.password)
        ) {
            return res.sendStatus(401);
        }

        id = query.id;
    } catch (e) {
        console.error(chalk.bold.red('Could not validate signin'), e);
        return res.sendStatus(500);
    }

    res.locals.userId = {
        userId: id,
    };

    next();
}
