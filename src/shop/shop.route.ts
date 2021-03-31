import * as Koa from 'koa';
import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import { Shop } from './entity/shop.entity';
import * as Passport from "koa-passport";
import { User } from '../users/entity/user.entity';
import {shopValidator} from '../validators/validators'
export const router = new Router({prefix: '/shop'});

router.get('/', async (ctx) => {
    const ShopRepo:Repository<Shop> = getRepository(Shop);
    const Shops = await ShopRepo.find();
    if(Shops) {
        ctx.body = Shops;
    }
    else {
        ctx.throw('Not Found', 404);
    }
});

router.get('/:id', async (ctx) => {
    const ShopRepo:Repository<Shop> = getRepository(Shop);
    const Shops = await ShopRepo.findOne(ctx.params.id);
    if(Shops) {
        ctx.body = Shops;
    }
    else {
        ctx.throw('Not Found', 404);
    }
});

router.post('/', async (ctx, next) => {
    return await Passport.authenticate('jwt', async (err, user) => {
        const ShopRepo:Repository<Shop> = getRepository(Shop);
        let findUser = await user;
        if(findUser) {
            let createdShop: Shop = new Shop();
            let { name } = ctx.request.body;
            if(name) {
                if(!shopValidator(name).error) {
                    createdShop.name = name;
                    createdShop.owner = findUser.id;
                    console.log(findUser);
                    ctx.body = ShopRepo.save(createdShop);
                } else {
                    ctx.throw('Bad Request', 402);
                }
                
            }
        }
        else {
            ctx.throw('Unauthorized', 401);
        }
    }) (ctx, next)
});

router.put('/:id', async (ctx) => {
    const ShopRepo:Repository<Shop> = getRepository(Shop);
    const shop: Shop = ctx.request.body as Shop;
    if(shop) {
        const updatedShop = await ShopRepo.update(ctx.params.id ,shop);
        if(updatedShop) {
            ctx.body = updatedShop.raw.message;
        }
    }
    else {
        ctx.throw('Bad Request', 402);
    }
});

router.delete('/:id', async (ctx) => {
    const ShopRepo:Repository<Shop> = getRepository(Shop);
    const shop: Shop = await ShopRepo.findOne(ctx.params.id);
    if(shop) {
        ctx.body = ShopRepo.delete(shop);
    }
    else {
        ctx.throw('Not Found', 404);
    }
});

export default router;