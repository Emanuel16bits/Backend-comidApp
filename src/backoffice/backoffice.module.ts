import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { BackofficeController } from './backoffice.controller';

@Module({
  imports: [UsersModule, RestaurantsModule],
  controllers: [BackofficeController],
})
export class BackofficeModule {}
