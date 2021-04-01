import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import { Shop } from './entity/shop.entity';
import * as Passport from "koa-passport";
import { shopValidator } from '../validators/validators'
import { Next } from 'koa';


class ShopController {

    public async GetAll(ctx: Router.IRouterContext, next: Next) {
        const ShopRepo: Repository<Shop> = getRepository(Shop);
        const Shops = await ShopRepo.find({ relations: ['owner'] });
        if (Shops) {
            ctx.body = Shops;
        }
        else {
            ctx.throw('Not Found', 404);
        }
    }

    public async GetMyShop(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const ShopRepo: Repository<Shop> = getRepository(Shop);
            if (user) {
                let findUser = await user;
                const Shops = await ShopRepo.find({ where: { owner: { id: findUser.id } }, relations: ['owner'] });
                if (Shops) {
                    ctx.body = Shops;
                }
                else {
                    ctx.throw('Not Found', 404);
                }
            }
            else {
                ctx.throw('Unauthorized', 403);
            }
        })(ctx, next)
    }

    public async GetOne(ctx: Router.IRouterContext, next: Next) {
        const ShopRepo: Repository<Shop> = getRepository(Shop);
        const Shops = await ShopRepo.findOne(ctx.params.id, { relations: ['owner'] });
        if (Shops) {
            ctx.body = Shops;
        }
        else {
            ctx.throw('Not Found', 404);
        }
    }

    public async CreateOne(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const ShopRepo: Repository<Shop> = getRepository(Shop);
            let findUser = await user;
            if (findUser) {
                let createdShop: Shop = new Shop();
                let { name } = ctx.request.body;
                if (name) {
                    try {
                        let shop = shopValidator.validate({ name });
                        if (shop.error) {
                            throw shop.error;
                        }
                        else {
                            createdShop.name = shop.value.name;
                            createdShop.owner = findUser.id;
                            ctx.body = await ShopRepo.save(createdShop);
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
        })(ctx, next)
    }

    public async UpdateOne(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const ShopRepo: Repository<Shop> = getRepository(Shop);
            let findShop = await ShopRepo.findOne(ctx.params.id, { relations: ['owner'] });
            let findUser = await user;
            if (findUser.id == findShop.owner.id) {
                let updatedShop: Shop = ctx.request.body as Shop;
                let { name } = updatedShop;
                if (name) {
                    try {
                        let shop = shopValidator.validate({ name });
                        if (shop.error) {
                            throw shop.error;
                        }
                        else {
                            ctx.body = await ShopRepo.update(ctx.params.id, updatedShop);
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
        })(ctx, next)
    }

    public async DeleteOne(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const ShopRepo: Repository<Shop> = getRepository(Shop);
            let findShop = await ShopRepo.findOne(ctx.params.id, { relations: ['owner'] });
            let findUser = await user;
            if (findUser.id == findShop.owner.id) {
                try {
                    ctx.body = (await ShopRepo.delete(ctx.params.id)).raw.affectedRows;
                }
                catch (err) {
                    ctx.throw(err, 402);
    
                }
            }
            else {
                ctx.throw('Unauthorized', 401);
            }
        })(ctx, next)
    }
}

export default new ShopController;