import * as Passport from "koa-passport";
import * as Router from "koa-router";
import AuthController from './auth.controller';
import UserController from '../users/user.controller';
export const router = new Router({prefix: '/auth'});



router.post('/login', AuthController.Login)
router.post('/register', UserController.CreateOne)

export default router;