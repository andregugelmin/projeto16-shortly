import joi from 'joi';

export const signUpSchema = joi.object({
    name: joi.string().alphanum().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.ref('password'),
});

export const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});
