import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn({ name: 'idCartItem' })
  id: number;

  @Column({ name: 'idCart', type: 'int' })
  carritoId: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCart' })
  carrito: Cart;

  @Column({ name: 'idProducto', type: 'int' })
  productoId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'idProducto' })
  producto: Product;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @CreateDateColumn({ name: 'fechaCreacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fechaActualizacion' })
  fechaActualizacion: Date;
}
