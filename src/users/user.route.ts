import * as Router from 'koa-router';
import UserController from './user.controller';
export const router = new Router({prefix: '/user'});

router.get('/', UserController.GetAll);

router.get('/:id', UserController.GetOne)

router.post('/', UserController.CreateOne)

router.put('/:id', UserController.UpdateOne)

router.delete('/:id', UserController.DeleteOne)

export default router;