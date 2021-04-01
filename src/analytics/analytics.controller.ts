import * as Router from 'koa-router';
import { getRepository, Repository, In, } from 'typeorm';
import * as Passport from "koa-passport";
import { Shop } from '../shop/entity/shop.entity';
import { Order } from '../order/entity/order.entity';
import { Product } from '../product/entity/product.entity';
import { Next } from 'koa';

class AnalyticsController {

    public async GetAllSells(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {

            const ShopRepo: Repository<Shop> = getRepository(Shop);
            const ProductRepo: Repository<Product> = getRepository(Product);
            const OrderRepo: Repository<Order> = getRepository(Order);

            if (user) {
                let findUser = await user;
                const shops = await ShopRepo.find({ where: { owner: { id: findUser.id } }, relations: ['owner'] })
                const products = await ProductRepo.find({ where: { shop: { id: In(shops.map(value => { return value.id }),) } } });
                const Orders = await OrderRepo.find({
                    where: { product: { id: In(products.map(value => { return value.id })) } },
                    relations: ['product']
                })

                if (Orders) {
                    let sellCount: number = 0, sellPrice: number = 0;
                    let arrayPrice = Orders.map(value => { return +value.product.price });
                    let arrayCount = Orders.map(value => { return +value.count })
                    let sum = arrayCount.map((v, i) => { return arrayPrice[i] * v })
                    arrayCount.forEach(value => { sellCount += value });
                    sum.forEach(value => { sellPrice += value });
                    ctx.body = { sellCount: sellCount, sellPrice: sellPrice };
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

    public async GetOneShopSells(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {

            const ShopRepo: Repository<Shop> = getRepository(Shop);
            const ProductRepo: Repository<Product> = getRepository(Product);
            const OrderRepo: Repository<Order> = getRepository(Order);

            if (user) {
                let shopId = ctx.params.id;
                let findUser = await user;
                const shops = await ShopRepo.findOne({ where: { id: shopId }, relations: ['owner'] });
                if (shops) {
                    if (shops.owner.id == findUser.id) {
                        const products = await ProductRepo.find({ where: { shop: { id: shops.id } } });
                        const Orders = await OrderRepo.find({
                            where: { product: { id: In(products.map(value => { return value.id })) } },
                            relations: ['product']
                        })

                        if (Orders) {
                            let sellCount: number = 0, sellPrice: number = 0;
                            let arrayPrice = Orders.map(value => { return +value.product.price });
                            let arrayCount = Orders.map(value => { return +value.count })
                            let sum = arrayCount.map((v, i) => { return arrayPrice[i] * v })
                            arrayCount.forEach(value => { sellCount += value });
                            sum.forEach(value => { sellPrice += value });
                            ctx.body = { sellCount: sellCount, sellPrice: sellPrice };
                        }
                        else {
                            ctx.throw('Not Found', 404);
                        }
                    }
                    else {
                        ctx.throw('Unauthorized', 403);
                    }
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

}

export default new AnalyticsController;