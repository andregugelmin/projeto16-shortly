import authenticationSchema from '../schemas/authenticationSchema.js';

export function validateSignup(req, res, next) {
    const user = req.body;
    const validation = authenticationSchema.validate(user);
    if (validation.error) {
        return res.status(422).send({
            message: 'Invalid category name',
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
