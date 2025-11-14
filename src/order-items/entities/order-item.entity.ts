import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';

export enum EstadoOrderItem {
  PENDIENTE = 'pendiente',
  CANCELADO = 'cancelado',
  ENTREGADO = 'entregado',
}

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn({ name: 'idOrderItem' })
  id: number;

  @Column({ name: 'idOrden' })
  idOrden: number;

  @Column({ name: 'idProducto' })
  idProducto: number;

  @Column()
  cantidad: number;

  @Column({
    type: 'enum',
    enum: EstadoOrderItem,
    default: EstadoOrderItem.PENDIENTE,
  })
  estado: EstadoOrderItem;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idOrden' })
  orden: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idProducto' })
  producto: Product;
}
