import * as dotenv from 'dotenv';
dotenv.config({ path: '.env-dev' });

import * as Koa from 'koa';
import * as KoaBody from 'koa-body';

import { router as UserRouter } from '../src/users/user.route';
import { router as AuthRouter } from '../src/auth/auth.router';
import { router as ShopRouter } from '../src/shop/shop.route';
import { router as ProductRouter } from '../src/product/product.route';
import { router as OrderRouter } from '../src/order/order.route';
import { router as AnalyticsRouter } from '../src/analytics/analytics.router';
import connection from './database/connection';

import * as passport from 'koa-passport';
import LocalStrategy from './auth/strategy/local.strategy';
import JwtStrategy from './auth/strategy/jwt.strategy';

import * as cors from '@koa/cors';

const app = new Koa();

app.use(KoaBody());
app.use(cors());

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
app.use(OrderRouter.routes()).use(OrderRouter.allowedMethods());
app.use(AnalyticsRouter.routes()).use(AnalyticsRouter.allowedMethods());
//

app.on('error', console.error);

connection
    .then(() => {
        app.listen(+process.env.SERVER_PORT || 3000, () => {
            console.log(`Server start on http://localhost:${+process.env.SERVER_PORT || 3000}`)
        })
    })
    .catch((err) => {
        console.error(err);
    });
