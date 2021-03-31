import * as dotenv from 'dotenv';
dotenv.config({path: '.env-dev'});

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as KoaBody from 'koa-body';

import {router as UserRouter}  from '../src/users/user.route';
import {router as AuthRouter}  from '../src/auth/auth.router';
import {router as ShopRouter}  from '../src/shop/shop.route';
import {router as ProductRouter}  from '../src/product/product.route';

import connection from './database/connection';

import * as passport from 'koa-passport';
import LocalStrategy from './auth/strategy/local.strategy';
import JwtStrategy from './auth/strategy/jwt.strategy';

const app = new Koa();

app.use(KoaBody());

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(LocalStrategy);
passport.use(JwtStrategy);
//

//ROUTES
app.use(UserRouter.routes()).use(UserRouter.allowedMethods());
app.use(AuthRouter.routes()).use(AuthRouter.allowedMethods());
app.use(ShopRouter.routes()).use(ShopRouter.allowedMethods());
app.use(ProductRouter.routes()).use(ProductRouter.allowedMethods());
//

app.on('error', console.error);

connection
.then(() => {
    app.listen(+process.env.SERVER_PORT || 3000, () => {
        console.log("Server start on http://localhost:" + +process.env.SERVER_PORT || 3000)
    })
})
.catch((err) => {
    console.error(err);
});
