import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import * as createOrderItemDto from './dto/create-order-item.dto';
import * as updateOrderItemDto from './dto/update-order-item.dto';
import * as yup from 'yup';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  async create(@Body() body: createOrderItemDto.CreateOrderItemDto) {
    try {
      const data = await createOrderItemDto.createOrderItemSchema.validate(
        body,
        {
          abortEarly: false,
          stripUnknown: true,
        },
      );
      return this.orderItemsService.create(data);
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
  findAll() {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: updateOrderItemDto.UpdateOrderItemDto,
  ) {
    try {
      const data = await updateOrderItemDto.updateOrderItemSchema.validate(
        body,
        {
          abortEarly: false,
          stripUnknown: true,
        },
      );
      return this.orderItemsService.update(+id, data);
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
  patch(
    @Param('id') id: string,
    @Body() updateOrderItemDto: Partial<UpdateOrderItemDto>,
  ) {
    return this.orderItemsService.update(+id, updateOrderItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderItemsService.remove(+id);
  }
}
