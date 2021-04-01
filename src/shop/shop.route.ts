import * as Router from 'koa-router';
export const router = new Router({ prefix: '/shop' });
import ShopController from './shop.controller';

router.get('/', ShopController.GetAll);

//Поиск своих магазинов
router.get('/myshops', ShopController.GetMyShop);

router.get('/:id', ShopController.GetOne);

//Создавать магазин может только зарегестрированный пользователь
router.post('/', ShopController.CreateOne);

//Обновлять магазин может только его владелец
router.put('/:id', ShopController.UpdateOne);

//Удалять магазин может только его владелец
router.delete('/:id', ShopController.DeleteOne);

export default router;