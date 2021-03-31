import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Product } from "../../product/entity/product.entity";
import { User } from "../../users/entity/user.entity";


@Entity()
export class Shop {

    @Column({primary: true, type: "uuid", generated:'uuid'})
    id: number;

    @Column({type: "varchar", length: 256, nullable: false, unique: true})
    name: string;

    @ManyToOne(() => User, user => user.shop)
    owner: User;

    @OneToMany(() => Product, product => product.shop)
    product: Product[];

}