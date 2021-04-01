import * as Router from 'koa-router';
import AnalyticsController from './analytics.controller';


export const router = new Router({ prefix: '/analytics' });

//Продажи по всем магазинам владельца и их общая стоимость
router.get('/sells', AnalyticsController.GetAllSells);

//Продажи по одному из магазинов владельца
router.get('/sells/shop/:id', AnalyticsController.GetOneShopSells);

