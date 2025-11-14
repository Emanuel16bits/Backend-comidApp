import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import * as yup from 'yup';
import * as createDto from './dto/create-payment.dto';
import * as updateDto from './dto/update-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() body: createDto.CreatePaymentDto) {
    try {
      const data = await createDto.createPaymentSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return this.paymentService.create(data);
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
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: updateDto.UpdatePaymentDto,
  ) {
    try {
      const data = await updateDto.updatePaymentSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return this.paymentService.update(+id, data);
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
  patch(@Param('id') id: string, @Body() partial: Partial<UpdatePaymentDto>) {
    return this.paymentService.updatePatch(+id, partial);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.paymentService.findByUser(+userId);
  }

  @Get('cart/:cartId')
  findByCart(@Param('cartId') cartId: string) {
    return this.paymentService.findByCart(+cartId);
  }
}
