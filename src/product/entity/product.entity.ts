import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Order } from "../../order/entity/order.entity";
import { Shop } from "../../shop/entity/shop.entity";


@Entity()
export class Product {

    @Column({primary: true, type: "uuid", generated:'uuid'})
    id: string;

    @Column({type: "varchar", length: 256, nullable: false})
    name: string;

    @Column({type: "decimal", nullable: false})
    price: number;

    @Column({type: "int", nullable: false})
    count: number;

    @ManyToOne(() => Shop, shop => shop.product)
    shop: Shop;

    @OneToMany(() => Order, order => order.product)
    order: Order[];

}