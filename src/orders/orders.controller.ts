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
import { OrdersService } from './orders.service';
import * as createOrderDto from './dto/create-order.dto';
import * as updateOrderDto from './dto/update-order.dto';
import * as yup from 'yup';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() body: createOrderDto.CreateOrderDto) {
    try {
      const data = await createOrderDto.createOrderSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return this.ordersService.create(data);
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
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: updateOrderDto.UpdateOrderDto,
  ) {
    try {
      const data = await updateOrderDto.updateOrderSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return this.ordersService.update(+id, data);
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
    @Body() updateOrderDto: Partial<UpdateOrderDto>,
  ) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
