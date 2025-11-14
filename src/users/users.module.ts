import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { Driver } from '../drivers/entities/driver.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RestaurantsModule),
    TypeOrmModule.forFeature([Driver]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
