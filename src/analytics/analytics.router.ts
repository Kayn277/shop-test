import * as Router from 'koa-router';
import { getRepository, Repository, In } from 'typeorm';
import * as Passport from "koa-passport";
import {shopValidator} from '../validators/validators'
import { User } from '../users/entity/user.entity';
import { Shop } from '../shop/entity/shop.entity';
import { Order } from '../order/entity/order.entity';
import { Product } from '../product/entity/product.entity';


export const router = new Router({prefix: '/analytics'});

//Продажи по всем магазинам владельца и их общая стоимость
router.get('/sells', async (ctx, next) => {
    return await Passport.authenticate('jwt', async (err, user) => {

        const ShopRepo:Repository<Shop> = getRepository(Shop);
        const ProductRepo:Repository<Product> = getRepository(Product);
        const OrderRepo:Repository<Order> = getRepository(Order);

        if(user) {
            let findUser = await user;
            const shops = await ShopRepo.find({where: {owner: {id: findUser.id}}, relations: ['owner']})
            const products = await ProductRepo.find({where: {shop: {id: shops.map(value => {return value.id},)}}});
            const Orders = await OrderRepo.find({
                where: {product: {id: products.map(value => {return value.id})}},
                relations: ['product']
            })

            if(Orders) {
                let sellCount: number = 0, sellPrice: number = 0;
                Orders.map(value => {return +value.count}).forEach(value => {sellCount += value});
                Orders.map(value => {return +value.product.price}).forEach(value => {sellPrice += value});
                ctx.body = {sellCount:sellCount, sellPrice: sellCount*sellPrice};
            }
            else {
                ctx.throw('Not Found', 404);
            }

        }
        else {
            ctx.throw('Unauthorized', 403);
        }
    })(ctx, next)
});

//Продажи по одному из магазинов владельца
router.get('/sells/shop/:id', async (ctx, next) => {
    return await Passport.authenticate('jwt', async (err, user) => {

        const ShopRepo:Repository<Shop> = getRepository(Shop);
        const ProductRepo:Repository<Product> = getRepository(Product);
        const OrderRepo:Repository<Order> = getRepository(Order);

        if(user) {
            let shopId = ctx.params.id;
            let findUser = await user;
            const shops = await ShopRepo.findOne({where: {id: shopId}, relations: ['owner']});
            if(shops) {
                if(shops.owner.id == findUser.id) {
                    const products = await ProductRepo.find({where: {shop: {id: shops.id}}});
                    const Orders = await OrderRepo.find({
                        where: {product: {id: products.map(value => {return value.id})}},
                        relations: ['product']
                    })
        
                    if(Orders) {
                        let sellCount: number = 0, sellPrice: number = 0;
                        Orders.map(value => {return +value.count}).forEach(value => {sellCount += value});
                        Orders.map(value => {return +value.product.price}).forEach(value => {sellPrice += value});
                        ctx.body = { sellCount:sellCount, sellPrice: sellCount*sellPrice };
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
});

//Поиск своих магазинов
