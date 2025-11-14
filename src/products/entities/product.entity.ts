import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { User } from '../../users/entities/user.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ name: 'idProduct' })
  idProduct: number;

  @Column({ name: 'nombre' })
  nombre: string;

  @Column({ name: 'precio', type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ name: 'descripcion' })
  descripcion: string;

  @Column({ name: 'stock' })
  stock: number;

  @Column({ name: 'imagen', nullable: true })
  imagen: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.producto)
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.productos)
  @JoinColumn({ name: 'userId' })
  usuario: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.productos)
  @JoinColumn({ name: 'restaurantId' })
  restaurante: Restaurant;

  @OneToMany(() => Favorite, (favorite) => favorite.producto)
  favoritos: Favorite[];
}
