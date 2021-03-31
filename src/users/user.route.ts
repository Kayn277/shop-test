import * as Koa from 'koa';
import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import { User } from './entity/user.entity';
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
        const createdUser = await userRepo.save(createUser);
        ctx.body = createdUser;
    }
    else {
        ctx.throw('Bad request', '400')
    }
    
    
})
router.put('/:id', async (ctx) => {
    const userRepo:Repository<User> = getRepository(User);
    const updateUser: User = ctx.request.body as User;
    const updatedUser = await userRepo.update(ctx.params.id, updateUser);
    if(updateUser) {
        ctx.body = updatedUser.raw.message;
    }
    else {
        ctx.throw('Not Found', '404')
    }
})

router.delete('/:id', async (ctx) => {
    const userRepo:Repository<User> = getRepository(User);
    const user = await userRepo.findOne(ctx.params.id);
    if(user) {
        await userRepo.delete(user.id);
        ctx.body = user;
    }
    else {
        ctx.throw('Not Found','404');
    }
})

export default router;