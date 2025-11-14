import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Put,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import type { CreateCartItemDto } from './dto/create-cart-item.dto';
import type { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { createCartItemSchema } from './dto/create-cart-item.dto';
import { updateCartItemSchema } from './dto/update-cart-item.dto';
import * as yup from 'yup';

@Controller('cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  async create(@Body() body: CreateCartItemDto) {
    try {
      const data = await createCartItemSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return await this.cartItemService.create(data);
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
    const items = await this.cartItemService.findAll();
    if (!items || items.length === 0) {
      throw new NotFoundException('No se encontraron items en el carrito');
    }
    return items;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      throw new BadRequestException('id de item no valido');
    }

    const item = await this.cartItemService.findOne(itemId);
    if (!item) {
      throw new NotFoundException(`item con id ${id} no encontrado`);
    }
    return item;
  }

  @Put(':id')
  async updatePut(@Param('id') id: string, @Body() body: UpdateCartItemDto) {
    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      throw new BadRequestException('id de item no valido');
    }

    try {
      const data = await updateCartItemSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const updatedItem = await this.cartItemService.update(itemId, data);
      if (!updatedItem) {
        throw new NotFoundException(
          `No se pudo actualizar el item con id ${id}`,
        );
      }
      return updatedItem;
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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCartItemDto) {
    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      throw new BadRequestException('id de item no valido');
    }

    try {
      const data = await updateCartItemSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const updatedItem = await this.cartItemService.update(itemId, data);
      if (!updatedItem) {
        throw new NotFoundException(
          `No se pudo actualizar el item con id ${id}`,
        );
      }
      return updatedItem;
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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'id de item no valido',
      });
    }
    return this.cartItemService.remove(itemId);
  }
}
