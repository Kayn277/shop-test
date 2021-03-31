import { Column, Entity, OneToMany } from "typeorm";
import { Shop } from "../../shop/entity/shop.entity";


@Entity()
export class User {

    @Column({primary: true, type: "uuid", generated:'uuid'})
    id: number;

    @Column({type: "varchar", length: 64, nullable: false})
    login: string;

    @Column({type: "text", nullable: false})
    password: string;

    @OneToMany(() => Shop, shop => shop.owner)
    shop: Shop[];

}