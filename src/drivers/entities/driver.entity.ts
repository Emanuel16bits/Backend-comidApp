import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  telefono: string | null;

  @Column({ type: 'varchar', nullable: true })
  tipoVehiculo: string | null;

  @Column({ type: 'varchar', nullable: true })
  placa: string | null;

  @Column({ type: 'varchar', nullable: true })
  marca: string | null;

  @Column({ type: 'varchar', nullable: true })
  modelo: string | null;

  @Column({ type: 'varchar', nullable: true })
  color: string | null;

  @Column({ type: 'int', nullable: true })
  anio: number | null;

  @Column({ default: true })
  disponible: boolean;

  @Column({ type: 'float', default: 0 })
  calificacion: number;

  @Column({ type: 'float', default: 0 })
  gananciasTotales: number;

  @OneToMany(() => Order, (pedido) => pedido.driver)
  pedidos: Order[];
}
