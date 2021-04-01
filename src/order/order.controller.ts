import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import * as Passport from "koa-passport";
import { Order } from './entity/order.entity';
import { Product } from '../product/entity/product.entity';
import { OrderStatuses } from './order.enums';
import { orderValidator } from '../validators/validators';
import { User } from '../users/entity/user.entity';
import { Next } from 'koa';


class OrderController {

    public async GetAll(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const OrderRepo: Repository<Order> = getRepository(Order);
            let findUser = await user;
            const orderFinds = await OrderRepo.find({ where: { user: { id: findUser.id } }, relations: ['user', 'product'] });
            if (orderFinds) {
                ctx.body = orderFinds;
            }
            else {
                ctx.throw('Not Found', 404);
            }
        })(ctx, next)
    }

    /**
     * Получает заказы которые уже доставлены клиенту (OrderEnum: Submitted - 2)
     */
    public async GetMyPurchases(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const OrderRepo: Repository<Order> = getRepository(Order);
            let findUser = await user;
            const orderFinds = await OrderRepo.find({ where: { user: { id: findUser.id }, status: 2 }, relations: ['user', 'product'] });
            if (orderFinds) {
                ctx.body = orderFinds;
            }
            else {
                ctx.throw('Not Found', 404);
            }
        })(ctx, next)
    }

    public async GetOne(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const OrderRepo: Repository<Order> = getRepository(Order);
            let findUser = await user;
            let id = ctx.params.id;
            const orderFinds = await OrderRepo.findOne({ where: { user: { id: findUser.id }, id: id }, relations: ['user', 'product'] });
            if (orderFinds) {
                ctx.body = orderFinds;
            }
            else {
                ctx.throw('Not Found', 404);
            }
        })(ctx, next)
    }

    public async CreateOne(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const OrderRepo: Repository<Order> = getRepository(Order);
            const ProductRepo: Repository<Product> = getRepository(Product);
            const UserRepo: Repository<User> = getRepository(User);
            let findUser = await user;
            if (findUser) {
                let order: Order = new Order();
                let { count, productId } = ctx.request.body;
                let findProduct = await ProductRepo.findOne(productId)
                let orderOpener = await UserRepo.findOne(findUser.id);
                order.user = orderOpener;
                order.count = count;
                order.product = findProduct;
                order.status = OrderStatuses.Processing;
                let validation = orderValidator.validate({ count: count, status: order.status });
                if (validation.error) {
                    ctx.throw(validation.error, 402)
                }
                else {
                    ctx.body = await OrderRepo.save(order);
                }
            }
            else {
                ctx.throw('Unauthorized', 401);
            }
        })(ctx, next)
    }

    public async UpdateOne(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const OrderRepo: Repository<Order> = getRepository(Order);
            let findUser = await user;
            let id = ctx.params.id;

            const orderFinds = await OrderRepo.findOne({ where: { id: id }, relations: ['user', 'product', 'product.shop', 'product.shop.owner'] });
            const getOwnerId = orderFinds.product.shop.owner.id;
            // Проверка на пользователя или владельца магазина для изменения заказа
            if ((findUser && (findUser.id == getOwnerId || findUser.id == orderFinds.user.id)) && orderFinds) {
                let order: Order = ctx.request.body as Order;
                let validation = orderValidator.validate({ count: order.count, status: order.status });
                if (validation.error) {
                    ctx.throw('Bad Request', 402)
                }
                else {
                    ctx.body = await OrderRepo.update(id, order);
                }
            }
            else {
                ctx.throw('Unauthorized', 401);
            }
        })(ctx, next)
    }

    public async DeleteOne(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const OrderRepo: Repository<Order> = getRepository(Order);
            let findUser = await user;
            let id = ctx.params.id;
            const orderFinds = await OrderRepo.findOne({ where: { user: { id: findUser.id }, id: id }, relations: ['user', 'product'] });
            if ((findUser && findUser.id == orderFinds.user.id) && orderFinds) {
                ctx.body = await OrderRepo.delete(id);
            }
            else {
                ctx.throw('Unauthorized', 401);
            }
        })(ctx, next)
    }
}

export default new OrderController;