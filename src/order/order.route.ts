import * as Router from 'koa-router';
import OrderController from './order.controller';

export const router = new Router({ prefix: '/order' });

router.get('/', OrderController.GetAll);

router.get('/mypurchases', OrderController.GetMyPurchases);

router.get('/:id', OrderController.GetOne);

router.post('/', OrderController.CreateOne);

router.put('/:id', OrderController.UpdateOne);

router.delete('/:id', OrderController.DeleteOne);

export default router;