import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import * as yup from 'yup';
import { BadRequestException } from '@nestjs/common';
import { EstadoPago, MetodoPago } from './entities/payment.entity';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: jest.Mocked<PaymentService>;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      updatePatch: jest.fn(),
      remove: jest.fn(),
      findByUser: jest.fn(),
      findByCart: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [{ provide: PaymentService, useValue: serviceMock }],
    }).compile();

    controller = module.get(PaymentController);
    service = module.get(PaymentService);
  });

  // ---------- CREATE ----------
  it('debería crear un pago', async () => {
    const body = {
      carritoId: 1,
      usuarioId: 2,
      monto: 100,
      metodo: MetodoPago.TARJETA,
      estado: EstadoPago.PENDIENTE,
      idTransaccion: 'abc123',
      detalles: null,
    };

    const created = { id: 1, ...body };

    jest.spyOn(yup.ObjectSchema.prototype, 'validate').mockResolvedValue(body);
    service.create.mockResolvedValue(created as any);

    const result = await controller.create(body);
    expect(result).toEqual(created);
  });

  it('debería lanzar error si falla la validación en POST', async () => {
    jest.spyOn(yup.ObjectSchema.prototype, 'validate').mockRejectedValue(
      new yup.ValidationError('validation failed')


    );

    await expect(controller.create({} as any)).rejects.toThrow(
      BadRequestException
    );
  });

  // ---------- FIND ALL ----------
  it('debería obtener todos los pagos', async () => {
    service.findAll.mockResolvedValue([]);

    const result = await controller.findAll();
    expect(result).toEqual([]);
  });

  // ---------- GET BY ID ----------
  it('debería obtener un pago por id', async () => {
    const payment = { id: 1 };

    service.findOne.mockResolvedValue(payment as any);

    const result = await controller.findOne('1');
    expect(result).toEqual(payment);
  });

  // ---------- UPDATE PUT ----------
  it('debería actualizar un pago con PUT', async () => {
    const body = { estado: EstadoPago.COMPLETADO };
    const updated = { id: 1, estado: EstadoPago.COMPLETADO };

    jest.spyOn(yup.ObjectSchema.prototype, 'validate').mockResolvedValue(body);
    service.update.mockResolvedValue(updated as any);

    const result = await controller.update('1', body);
    expect(result).toEqual(updated);
  });

  it('debería lanzar error si falla validación en PUT', async () => {
    jest.spyOn(yup.ObjectSchema.prototype, 'validate').mockRejectedValue(
      new yup.ValidationError('validation failed')

    );

    await expect(
      controller.update('1', { estado: 'INVALIDO' } as any)
    ).rejects.toThrow(BadRequestException);
  });

  // ---------- PATCH ----------
  it('debería actualizar parcialmente con PATCH', async () => {
    const body = { monto: 150 };
    const updated = { id: 1, monto: 150 };

    service.updatePatch.mockResolvedValue(updated as any);

    const result = await controller.patch('1', body);
    expect(result).toEqual(updated);
  });

  // ---------- DELETE ----------
  it('debería eliminar un pago', async () => {
    service.remove.mockResolvedValue(undefined);

    const result = await controller.remove('1');
    expect(result).toBeUndefined();
  });

  // ---------- FIND BY USER ----------
  it('debería obtener pagos por usuario', async () => {
    const list = [{ id: 1 }];

    service.findByUser.mockResolvedValue(list as any);

    const result = await controller.findByUser('4');
    expect(result).toEqual(list);
  });

  // ---------- FIND BY CART ----------
  it('debería obtener pagos por carrito', async () => {
    const list = [{ id: 1 }];

    service.findByCart.mockResolvedValue(list as any);

    const result = await controller.findByCart('99');
    expect(result).toEqual(list);
  });
});
