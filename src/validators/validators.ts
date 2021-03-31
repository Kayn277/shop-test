import * as Joi from 'joi';

export const registerValidator = Joi.object({
    login: Joi.string().min(4).max(64).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,256}$')).required()
})

export const updateUserValidator = Joi.object({
    login: Joi.string().min(4).max(64).required()
})

export const shopValidator = Joi.object({
    name: Joi.string().min(4).max(256).required(),
})

export const productValidator = Joi.object({
    name: Joi.string().min(4).max(256).required(),
    price: Joi.number().required(),
    count: Joi.number().required()
})

export const orderValidator = Joi.object({
    count: Joi.number().required(),
    status: Joi.number().required()
})

// @Column({primary: true, type: "uuid", generated:'uuid'})
//     id: number;

//     @Column({type: "int", nullable: false})
//     Count: number;

//     @Column({type: "decimal", nullable: false})
//     price: number;

//     @Column({type: "int", nullable: false})
//     count: number;

//     @ManyToOne(() => Product, product => product.order)
//     product: Product;

//     @ManyToOne(() => User, user => user.order)
//     user: User;
