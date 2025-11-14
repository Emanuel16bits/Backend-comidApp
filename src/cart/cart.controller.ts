import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import type { CreateCartDto } from './dto/create-cart.dto';
import type { UpdateCartDto } from './dto/update-cart.dto';
import { createCartSchema } from './dto/create-cart.dto';
import { updateCartSchema } from './dto/update-cart.dto';
import * as yup from 'yup';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async create(@Body() body: CreateCartDto) {
    try {
      const data = await createCartSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return this.cartService.create(data);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Error',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  @Get()
  async findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cartId = parseInt(id, 10);
    if (isNaN(cartId)) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'id de carrito no válido',
      });
    }
    return this.cartService.findOne(cartId);
  }

  @Put(':id')
  async updatePut(@Param('id') id: string, @Body() body: UpdateCartDto) {
    const cartId = parseInt(id, 10);
    if (isNaN(cartId)) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'id de carrito no válido',
      });
    }

    try {
      const data = await updateCartSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return this.cartService.update(cartId, data);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Error',
          errors: error.errors,
        });
      }
      throw new BadRequestException({
        statusCode: 400,
      });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCartDto) {
    const cartId = parseInt(id, 10);
    if (isNaN(cartId)) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'id de carrito no válido',
      });
    }

    try {
      const data = await updateCartSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return this.cartService.update(cartId, data);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Error',
          errors: error.errors,
        });
      }
      throw new BadRequestException({
        statusCode: 400,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const cartId = parseInt(id, 10);
    if (isNaN(cartId)) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'id de carrito no valido',
      });
    }
    return this.cartService.remove(cartId);
  }
}
