import * as Joi from 'joi';

export const loginValidator = Joi.object({
    login: Joi.string().min(4).max(64).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,256}$')).required()
})


export const shopValidator = Joi.object({
    name: Joi.string().min(4).max(256).required(),
}).validate