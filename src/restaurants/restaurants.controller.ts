import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import type { CreateRestaurantDto } from './dto/create-restaurant.dto';
import type { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { UsersService } from '../users/users.service';
import * as yup from 'yup';
import { BadRequestException } from '@nestjs/common';
import { createRestaurantSchema } from './dto/create-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() body: CreateRestaurantDto) {
    try {
      const data = await createRestaurantSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return this.restaurantsService.create(data);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Error de validación',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get('usuario/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.restaurantsService.findByUser(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(+id, updateRestaurantDto);
  }

  @Patch(':id')
  patch(
    @Param('id') id: string,
    @Body() updateRestaurantDto: Partial<UpdateRestaurantDto>,
  ) {
    return this.restaurantsService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(+id);
  }
}
