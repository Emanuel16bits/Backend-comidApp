import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { User } from '../../users/entities/user.entity';

export enum EstadoPago {
  PENDIENTE = 'pendiente',
  COMPLETADO = 'completado',
  FALLIDO = 'fallido',
  REEMBOLSADO = 'reembolsado',
}

export enum MetodoPago {
  TARJETA = 'tarjeta',
  EFECTIVO = 'efectivo',
  TRANSFERENCIA = 'transferencia',
  MERCADO_PAGO = 'mercadopago',
}

@Entity('pagos')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.pagos, { nullable: false })
  carrito: Cart;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  monto: number;

  @Column({
    type: 'enum',
    enum: EstadoPago,
    default: EstadoPago.PENDIENTE,
  })
  estado: EstadoPago;

  @Column({
    type: 'enum',
    enum: MetodoPago,
    nullable: false,
  })
  metodo: MetodoPago;

  @Column({
    name: 'id_transaccion',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  idTransaccion: string | null;

  @ManyToOne(() => User, { nullable: false })
  usuario: User;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @Column({ type: 'json', nullable: true })
  detalles: Record<string, any> | null;
}
