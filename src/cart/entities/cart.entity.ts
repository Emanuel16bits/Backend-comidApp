import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CartItem } from '../../cart-item/entities/cart-item.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn({ name: 'idCart' })
  idCart: number;

  @Column({ name: 'usuarioId', type: 'int' })
  usuarioId: number;

  @ManyToOne(() => User, (usuario) => usuario.carritos)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @Column({
    name: 'total',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  total: number;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fechaCreacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fechaActualizacion' })
  fechaActualizacion: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.carrito, { cascade: true })
  items: CartItem[];

  @OneToMany(() => Payment, (payment) => payment.carrito)
  pagos: Payment[];
}
