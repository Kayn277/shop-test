import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as Passport from "koa-passport";
import {updateUserValidator, registerValidator} from '../validators/validators'


export const router = new Router({prefix: '/user'});

router.get('/', async (ctx) => {
    const userRepo:Repository<User> = getRepository(User);
    const users = await userRepo.find();
    if(users) {
        ctx.body = users;
    }
    else {
        ctx.throw('Not Found','404');
    }
});

router.get('/:id', async (ctx) => {
    const userRepo:Repository<User> = getRepository(User);
    const user = await userRepo.findOne(ctx.params.id);
    if(user) {
        ctx.body = user;
    }
    else {
        ctx.throw('Not Found','404');
    }
})

router.post('/', async (ctx) => {
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
})
router.put('/:id', async (ctx, next) => {
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
})

router.delete('/:id', async (ctx, next) => {
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
})

export default router;