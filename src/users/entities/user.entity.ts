import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';
import { Order } from '../../orders/entities/order.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Product } from '../../products/entities/product.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Cart } from '../../cart/entities/cart.entity';

export enum UserRole {
  ADMIN = 'admin',
  CLIENTE = 'cliente',
  VENDEDOR = 'vendedor',
  REPARTIDOR = 'repartidor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'idUsuario' })
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENTE,
  })
  rol: UserRole;

  @OneToMany(() => Review, (review) => review.usuario)
  resenas: Review[];

  @OneToMany(() => Order, (order) => order.usuario)
  ordenes: Order[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.usuario)
  restaurantes: Restaurant[];

  @OneToMany(() => Product, (product) => product.usuario)
  productos: Product[];

  @OneToMany(() => Favorite, (favorite) => favorite.usuario)
  favoritos: Favorite[];

  @OneToMany(() => Cart, (cart) => cart.usuario)
  carritos: Cart[];
}
