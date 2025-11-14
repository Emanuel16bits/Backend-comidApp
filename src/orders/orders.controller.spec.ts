import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import * as yup from 'yup';
import { BadRequestException } from '@nestjs/common';
import { EstadoOrden } from './entities/order.entity';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: jest.Mocked<OrdersService>;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: serviceMock }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get(OrdersService);
  });

  it('debería crear una orden', async () => {
    const body = {
      precioTotal: 200,
      idUsuario: 1,
      estado: EstadoOrden.PENDIENTE
    };

    const created = { id: 1, ...body };

    jest.spyOn(yup.ObjectSchema.prototype, 'validate').mockResolvedValue(body);

    service.create.mockResolvedValue(created as any);

    const result = await controller.create(body);

    expect(result).toEqual(created);
  });

  it('debería lanzar error si falla la validación en POST', async () => {
    jest.spyOn(yup.ObjectSchema.prototype, 'validate').mockRejectedValue(
      new yup.ValidationError(['error1'] as any, undefined, 'precioTotal')

    );

    await expect(controller.create({} as any)).rejects.toThrow(
      BadRequestException
    );
  });

  it('debería obtener todas las órdenes', async () => {
    service.findAll.mockResolvedValue([]);

    expect(await controller.findAll()).toEqual([]);
  });

  it('debería obtener una orden por id', async () => {
    const order = { id: 1 };

    service.findOne.mockResolvedValue(order as any);

    expect(await controller.findOne('1')).toEqual(order);
  });

  it('debería actualizar una orden con PUT', async () => {
    const body = { estado: EstadoOrden.ENTREGADA };
    const updated = { id: 1, estado: EstadoOrden.ENTREGADA };

    jest.spyOn(yup.ObjectSchema.prototype, 'validate').mockResolvedValue(body);

    service.update.mockResolvedValue(updated as any);

    expect(await controller.update('1', body)).toEqual(updated);
  });

  it('debería lanzar error si falla la validación en PUT', async () => {
    jest.spyOn(yup.ObjectSchema.prototype, 'validate').mockRejectedValue(
      new yup.ValidationError(['estado inválido'] as any, undefined, 'estado')

    );

    await expect(
      controller.update('1', { estado: 'INVALIDO' } as any)
    ).rejects.toThrow(BadRequestException);
  });

  it('debería hacer PATCH', async () => {
    const body = { estado: EstadoOrden.EN_CAMINO };
    const updated = { id: 1, estado: EstadoOrden.EN_CAMINO };

    service.update.mockResolvedValue(updated as any);

    expect(await controller.patch('1', body)).toEqual(updated);
  });

  it('debería eliminar una orden', async () => {
    service.remove.mockResolvedValue({ message: 'Orden con id 1 eliminada' });

    expect(await controller.remove('1')).toEqual({
      message: 'Orden con id 1 eliminada'
    });
  });
});
