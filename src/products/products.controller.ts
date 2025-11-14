import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  BadRequestException,
  Patch,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import * as createProductDto from './dto/create-product.dto';
import * as updateProductDto from './dto/update-product.dto';
import * as yup from 'yup';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() body: createProductDto.CreateProductDto) {
    try {
      const data = await createProductDto.createProductSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return this.productsService.create(data);
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
  async findAll(@Query('restaurantId') restaurantId?: string) {
    if (restaurantId) {
      return this.productsService.findByRestaurant(+restaurantId);
    }
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.productsService.findByUser(+userId);
  }

  @Get('restaurant/:restaurantId')
  findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.productsService.findByRestaurant(+restaurantId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: updateProductDto.UpdateProductDto,
  ) {
    try {
      const data = await updateProductDto.updateProductSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return this.productsService.update(+id, data);
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

  @Patch(':id')
  async patch(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<UpdateProductDto>,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
