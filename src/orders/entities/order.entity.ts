import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';

export enum EstadoOrden {
  PENDIENTE = 'pendiente',
  EN_PREPARACION = 'en_preparacion',
  EN_CAMINO = 'en_camino',
  ENTREGADA = 'entregada',
  CANCELADA = 'cancelada',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ name: 'idOrden' })
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioTotal: number;

  @Column({
    type: 'enum',
    enum: EstadoOrden,
    default: EstadoOrden.PENDIENTE,
  })
  estado: EstadoOrden;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ name: 'idUsuario' })
  idUsuario: number;

  @ManyToOne(() => User, (user) => user.ordenes)
  @JoinColumn({ name: 'idUsuario' })
  usuario: User;
  @ManyToOne(() => Driver, (driver) => driver.pedidos, { nullable: true })
  driver: Driver;
  @OneToMany(() => OrderItem, (orderItem) => orderItem.orden, {
    cascade: true,
    eager: true,
  })
  orderItems: OrderItem[];
}
