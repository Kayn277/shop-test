import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Product } from "../../product/entity/product.entity";
import { User } from "../../users/entity/user.entity";
import { OrderStatuses } from "../order.enums";


@Entity()
export class Order {

    @Column({primary: true, type: "uuid", generated:'uuid'})
    id: string;

    @Column({type: "int", nullable: false})
    count: number;

    @Column({type: "int", nullable: false})
    status: number;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    orderDate: string;

    @ManyToOne(() => Product, product => product.order)
    product: Product;

    @ManyToOne(() => User, user => user.order)
    user: User;

}