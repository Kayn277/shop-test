import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import * as Passport from "koa-passport";
import { productValidator } from '../validators/validators'
import { Product } from './entity/product.entity';
import { Shop } from '../shop/entity/shop.entity';
import { Next } from 'koa';


class ProductController {

    public async GetAll(ctx: Router.IRouterContext, next: Next) {
        const ProductRepo: Repository<Product> = getRepository(Product);
        const ProductFind = await ProductRepo.find();
        if (ProductFind) {
            ctx.body = ProductFind;
        }
        else {
            ctx.throw('Not Found', 404);
        }
    }

    public async GetOne(ctx: Router.IRouterContext, next: Next) {
        const ProductRepo: Repository<Product> = getRepository(Product);
        const ProductFind = await ProductRepo.findOne(ctx.params.id, {relations: ['shop']});
        if (ProductFind) {
            ctx.body = ProductFind;
        }
        else {
            ctx.throw('Not Found', 404);
        }
    }

    public async CreateOne(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const ShopRepo: Repository<Shop> = getRepository(Shop);
            const ProductRepo: Repository<Product> = getRepository(Product);
            let findUser = await user;
            if (findUser) {
                let { name, price, count, shopId } = ctx.request.body;
                if (!shopId) ctx.throw("Bad Request", 402);
                let findShop = await ShopRepo.findOne({ where: { id: shopId }, relations: ['owner'] });
                if (findShop.owner.id == findUser.id) {
                    try {

                        let product = productValidator.validate({
                            name: name,
                            price: price,
                            count: count
                        });
                        if (product.error) {
                            throw product.error;
                        }
                        else {
                            let product: Product = new Product();
                            product.name = name;
                            product.price = price;
                            product.count = count;
                            product.shop = findShop;
                            ctx.body = await ProductRepo.save(product);
                        }
                    }
                    catch (err) {
                        ctx.throw(err, 402);
                    }
                }
                else {
                    ctx.throw('Bad Request', 402);
                }
            }
            else {
                ctx.throw('Unauthorized', 401);
            }
        })(ctx, next)
    }

    public async UpdateOne(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const ProductRepo: Repository<Product> = getRepository(Product);
            let findUser = await user;
            if (findUser) {
                let updatedProduct: Product = ctx.request.body as Product;
                let findProduct = await ProductRepo.findOne(ctx.params.id, { relations: ['shop', 'shop.owner'] }); // Поиск продукта
                if (findProduct && findProduct.shop.owner.id == findUser.id) {
                    if (updatedProduct) {
                        try {
                            let product = productValidator.validate({
                                name: updatedProduct.name,
                                price: updatedProduct.price,
                                count: updatedProduct.count
                            });
                            if (product.error) {
                                throw product.error;
                            }
                            else {
                                ctx.body = await ProductRepo.update(ctx.params.id, updatedProduct);
                            }
                        }
                        catch (err) {
                            ctx.throw(err, 402);
                        }
                    }
                }
                else {
                    ctx.throw('Bad Request', 402);
                }
            }
            else {
                ctx.throw('Unauthorized', 401);
            }
        })(ctx, next)
    }

    public async DeleteOne(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('jwt', async (err, user) => {
            const ProductRepo: Repository<Product> = getRepository(Product);
            let findUser = await user;
            if (findUser) {
                let findProduct = await ProductRepo.findOne(ctx.params.id, { relations: ['shop', 'shop.owner'] });
                if (findProduct && findProduct.shop.owner.id == findUser.id) {
                    ctx.body = ProductRepo.delete(ctx.params.id);
                }
                else {
                    ctx.throw('Bad Request', 402);
                }
            }
            else {
                ctx.throw('Unauthorized', 401);
            }
        })(ctx, next)
    }
}

export default new ProductController;