import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as Passport from "koa-passport";
import {updateUserValidator, registerValidator} from '../validators/validators'
import { Next } from 'koa';


class UserController {

    public async GetAll(ctx: Router.IRouterContext, next: Next) {
        const userRepo:Repository<User> = getRepository(User);
        const users = await userRepo.find();
        if(users) {
            users.forEach(value => delete value.password)
            ctx.body = users;
        }
        else {
            ctx.throw('Not Found','404');
        }
    }

    public async GetOne(ctx: Router.IRouterContext, next: Next) {
        const userRepo:Repository<User> = getRepository(User);
        const user = await userRepo.findOne(ctx.params.id);
        if(user) {
            delete user.password;
            ctx.body = user;
        }
        else {
            ctx.throw('Not Found','404');
        }
    }

    public async CreateOne(ctx: Router.IRouterContext, next: Next) {
        const userRepo:Repository<User> = getRepository(User);
        const createUser: User = ctx.request.body as User;
        if(createUser) {
            try {
                let user = registerValidator.validate({ login: createUser.login, password: createUser.password });
                if(user.error) {
                    throw user.error;
                }
                else {
                    const createdUser = await userRepo.save(createUser);
                    ctx.body = createdUser;
                }
            }
            catch (err) {
                ctx.throw(err, 402);
            }
        }
        else {
            ctx.throw('Bad request', '400')
        }
    }

    public async UpdateOne(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const userRepo:Repository<User> = getRepository(User);
            let findUser = await user;
            if(findUser) {
                let updatedUser: User = ctx.request.body as User;
                let { login } = updatedUser;
                if(login) {
                    try {
                        let user = updateUserValidator.validate({ login });
                        if(user.error) {
                            throw user.error;
                        }
                        else {
                            ctx.body = await userRepo.update(ctx.params.id, updatedUser);
                        }
                    }
                    catch (err) {
                        ctx.throw(err, 402);
                    }
                }
            }
            else {
                ctx.throw('Unauthorized', 401);
            }
        }) (ctx, next)
    }

    public async DeleteOne(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const userRepo:Repository<User> = getRepository(User);
            let findUser = await user;
            if(findUser) {
                let deleteUser = await userRepo.findOne(ctx.params.id);
                if(deleteUser.id == findUser.id) {
                    ctx.body = (await userRepo.delete(deleteUser.id)).raw.affectedRows;
                }
                
            }
            else {
                ctx.throw('Unauthorized', 401);
            }
        }) (ctx, next)
    }
}

export default new UserController;