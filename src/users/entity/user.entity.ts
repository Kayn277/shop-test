import { Column, Entity, OneToMany } from "typeorm";
import { Order } from "../../order/entity/order.entity";
import { Shop } from "../../shop/entity/shop.entity";


@Entity()
export class User {

    @Column({primary: true, type: "uuid", generated:'uuid'})
    id: string;

    @Column({type: "varchar", length: 64, nullable: false, unique: true})
    login: string;

    @Column({type: "text", nullable: false})
    password: string;

    @OneToMany(() => Shop, shop => shop.owner)
    shop: Shop[];

    @OneToMany(() => Order, order => order.user)
    order: Order[];

}