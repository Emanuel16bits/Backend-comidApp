import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService],
  imports: [TypeOrmModule.forFeature([CartItem, Cart, Product])],
  exports: [CartItemService],
})
export class CartItemModule {}
