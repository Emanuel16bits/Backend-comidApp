import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favoritos, { onDelete: 'CASCADE' })
  usuario: User;

  @ManyToOne(() => Product, (product) => product.favoritos, {
    onDelete: 'CASCADE',
  })
  producto: Product;
}
