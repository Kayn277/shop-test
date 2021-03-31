import * as Router from 'koa-router';
import { getRepository, Repository } from 'typeorm';
import * as Passport from "koa-passport";
import {productValidator} from '../validators/validators'
import { Product } from './entity/product.entity';
import { Shop } from '../shop/entity/shop.entity';


export const router = new Router({prefix: '/product'});

router.get('/', async (ctx) => {
    const ProductRepo:Repository<Product> = getRepository(Product);
    const ProductFind = await ProductRepo.find();
    if(ProductFind) {
        ctx.body = ProductFind;
    }
    else {
        ctx.throw('Not Found', 404);
    }
});

router.get('/:id', async (ctx) => {
    const ProductRepo:Repository<Product> = getRepository(Product);
    const ProductFind = await ProductRepo.findOne(ctx.params.id);
    if(ProductFind) {
        ctx.body = ProductFind;
    }
    else {
        ctx.throw('Not Found', 404);
    }
});

router.post('/', async (ctx, next) => {
    return await Passport.authenticate('jwt', async (err, user) => {
        const ShopRepo:Repository<Shop> = getRepository(Shop);
        const ProductRepo:Repository<Product> = getRepository(Product);
        let findUser = await user;
        if(findUser) {
            let createProduct:Product = ctx.request.body as Product;
            let findShop = await ShopRepo.findOne({where: {id: createProduct.shop}, relations: ['owner']});
            console.log(createProduct.shop);
            if(findShop.owner.id == findUser.id)
            {
                if(createProduct) {
                    try {

                        let product = productValidator.validate({
                            name: createProduct.name, 
                            price: createProduct.price, 
                            count: createProduct.count
                        });

                        if(product.error) {
                            throw product.error;
                        }
                        else {
                            ctx.body = await ProductRepo.save(createProduct);
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
    }) (ctx, next)
});

router.put('/:id', async (ctx, next) => {
    return await Passport.authenticate('jwt', async (err, user) => {
        const ShopRepo:Repository<Shop> = getRepository(Shop);
        const ProductRepo:Repository<Product> = getRepository(Product);
        let findUser = await user;
        if(findUser) {
            let updatedProduct:Product = ctx.request.body as Product;
            let findProduct = await ProductRepo.findOne(ctx.params.id, {relations: ['shop', 'shop.owner']}); // Поиск продукта
            if(findProduct && findProduct.shop.owner.id == findUser.id) 
            {
                if(updatedProduct) {
                    try {
                        let product = productValidator.validate({
                            name: updatedProduct.name, 
                            price: updatedProduct.price, 
                            count: updatedProduct.count
                        });
                        if(product.error) {
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
    }) (ctx, next)
});

router.delete('/:id', async (ctx, next) => {
    return await Passport.authenticate('jwt', async (err, user) => {
        const ProductRepo:Repository<Product> = getRepository(Product);
        let findUser = await user;
        if(findUser) {
            let findProduct = await ProductRepo.findOne(ctx.params.id, {relations: ['shop', 'shop.owner']}); 
            if(findProduct && findProduct.shop.owner.id == findUser.id) 
            {
                ctx.body = ProductRepo.delete(ctx.params.id);
            }
            else {
                ctx.throw('Bad Request', 402);
            }
        }
        else {
            ctx.throw('Unauthorized', 401);
        }
    }) (ctx, next)
});

export default router;