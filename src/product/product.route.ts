import * as Router from 'koa-router';
import ProductController from './product.controller';

export const router = new Router({ prefix: '/product' });

router.get('/', ProductController.GetAll);

router.get('/:id', ProductController.GetOne);

router.post('/', ProductController.CreateOne);

router.put('/:id', ProductController.UpdateOne);

router.delete('/:id', ProductController.DeleteOne);

export default router;