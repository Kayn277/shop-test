
Paths:
Auth
POST /auth/login - Authorizate user return jwt token response: {"login":"login", "token":"token"}

User
```ts
export class User {
    id: string; // UUID autogenereated
    login: string; // min 4 max 64 symbols, required
    password: string; // min 8 max 256 symbols, required
}
```
GET /user - Get All users without passwords
GET /user/:id - Get user with search id without passwords
POST /user - Create new user {"login":"login", "password":"password"} password encrypt by bcrypt
PUT /user/:id - Update {"password":"password"} User can change only own data
DELETE /user/:id - Delete user. User can delete self data only

Shop
```ts
export class Shop {
    id: string; // UUID autogenereated
    name: string; // min 4 max 256 symbols, required
    owner: User; // Owner auto created via JWT paload user id
}
```
GET /shop - Get All shops
GET /shop/:id - Get shop with search id
GET /shop/myshops - User can get all own shops via JWT paload id
POST /shop - Create new shop {"name":"name"} Shop may create only registered user
PUT /shop/:id - Update {"name":"name"} Only owner can change own shops
DELETE /shop/:id - Delete shop. Only owner can delete own shops

Product
```ts
export class Product {
    id: string; // UUID autogenereated
    name: string; // min 4 max 256 symbols, required
    count: number; // Product count, number, required
    price: number; // Product price in rubles, number, required
}
```
GET /product - Get All products
GET /product/:id - Get product with search id
POST /product - Create new shop {"name":"name", "count":0, "price":0, "shopId":"shopId"} Owner may create product to his shop
PUT /product/:id - Update {"name":"name", "count":0, "price":0} Only shop owner can change own products
DELETE /product/:id - Delete product. Only shop owner can delete own products

Order
```ts
export class Order {
    id: string; // UUID autogenereated
    count: number; // Product count, number, required
    status: number; // Initial order status is processing
    orderDate: string;
    product: Product;
    user: User;
}
```
```ts
export enum OrderStatuses {
    Reject = -1,
    Processing = 0,
    Submitted = 1,
    Arrived = 2
}
```
GET /order - Get all order. User only can see their orders
GET /order/:id - Get order by id. User only can see their orders
POST /order - Create new order {"count":0, "productId":"productId"} Only registered user can create order. Initial status - Processing
PUT /order/:id - Update {"count":0, "status":0} Only shop owner or user can change order
DELETE /order/:id - Delete order. Only user can delete order


Analytics
```json
Response type
{
    "sellCount":0,
    "sellPrice":0
}
```
GET /sells - Get all sells products from all owner shops. Only user with shops can see thier sells
GET /sells/shop/:id - Get sells products from shop finded by id. Only user with shops can see thier sells
