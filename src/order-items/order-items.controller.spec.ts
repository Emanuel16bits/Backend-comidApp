import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';
import * as yup from 'yup';
import { BadRequestException } from '@nestjs/common';

describe('OrderItemsController', () => {
  let controller: OrderItemsController;
  let service: jest.Mocked<OrderItemsService>;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemsController],
      providers: [{ provide: OrderItemsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<OrderItemsController>(OrderItemsController);
    service = module.get(OrderItemsService);
  });

  it('debería crear un order-item', async () => {
    const body = { idOrden: 1, idProducto: 10, cantidad: 2 };
    const created = { id: 1, ...body };

    jest
      .spyOn(yup.ObjectSchema.prototype, 'validate')
      .mockResolvedValue(body as any);

    service.create.mockResolvedValue(created as any);

    const result = await controller.create(body);

    expect(result).toEqual(created);
  });

  it('debería tirar error si la validación falla en el POST', async () => {
    const body: any = {};

    const error = new yup.ValidationError("error", undefined, "path")


    jest
      .spyOn(yup.ObjectSchema.prototype, 'validate')
      .mockRejectedValue(error);

    await expect(controller.create(body)).rejects.toThrow(BadRequestException);
  });

  it('debería obtener todos', async () => {
    service.findAll.mockResolvedValue([]);

    const result = await controller.findAll();
    expect(result).toEqual([]);
  });

  it('debería obtener uno por id', async () => {
    const item = { id: 1 };
    service.findOne.mockResolvedValue(item as any);

    const result = await controller.findOne('1');
    expect(result).toEqual(item);
  });

  it('debería actualizar con PUT', async () => {
    const body = { cantidad: 5 };
    const updated = { id: 1, cantidad: 5 };

    jest
      .spyOn(yup.ObjectSchema.prototype, 'validate')
      .mockResolvedValue(body);

    service.update.mockResolvedValue(updated as any);

    const result = await controller.update('1', body);
    expect(result).toEqual(updated);
  });

  it('debería tirar error si falla validación en PUT', async () => {
    const body: any = { cantidad: -1 };

    const error = new yup.ValidationError("error", undefined, "path")



    jest
      .spyOn(yup.ObjectSchema.prototype, 'validate')
      .mockRejectedValue(error);

    await expect(controller.update('1', body)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('debería hacer PATCH', async () => {
    const body = { cantidad: 3 };
    const updated = { id: 1, cantidad: 3 };

    service.update.mockResolvedValue(updated as any);

    const result = await controller.patch('1', body);
    expect(result).toEqual(updated);
  });

  it('debería eliminar un order-item', async () => {
    service.remove.mockResolvedValue({ message: 'OrderItem con id 1 eliminado' });

    const result = await controller.remove('1');
    expect(result).toEqual({ message: 'OrderItem con id 1 eliminado' });
  });
});
