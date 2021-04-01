import * as Passport from "koa-passport";
import * as Router from "koa-router";
import * as Jwt from 'jsonwebtoken';
import { Next } from 'koa';


class AuthController {

    public async Login(ctx: Router.IRouterContext, next: Next) {
        return await Passport.authenticate('local', (err, user) => {
            if(user == false) {
                ctx.body = 'Unauthorized';
                ctx.status = 401;
            } 
            else {
                const payload = {id: user.id, login: user.login};
                const token = Jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
                ctx.body = {login: user.login, token: token};
            }
        }) (ctx, next)
    }

}

export default new AuthController;