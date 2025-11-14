import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Cart } from '../cart/entities/cart.entity';
import { User } from '../users/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MetodoPago, EstadoPago } from './entities/payment.entity';

describe('PaymentService', () => {
  let service: PaymentService;

  const paymentRepo = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const cartRepo = {
    findOne: jest.fn(),
  };

  const userRepo = {
    findOne: jest.fn(),
  };

  // DTO base para evitar errores de tipos
  const baseDto = {
    carritoId: 1,
    usuarioId: 1,
    monto: 100,
    metodo: MetodoPago.TARJETA,
    estado: EstadoPago.PENDIENTE,
    detalles: null,
    idTransaccion: null
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: getRepositoryToken(Payment), useValue: paymentRepo },
        { provide: getRepositoryToken(Cart), useValue: cartRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get(PaymentService);

    jest.clearAllMocks();
  });

  describe('create()', () => {

    it('crea un pago correctamente', async () => {
      cartRepo.findOne.mockResolvedValue({
        idCart: 1,
        usuario: { id: 1 },
      });

      userRepo.findOne.mockResolvedValue({ id: 1 });

      paymentRepo.save.mockResolvedValue({ id: 5, ...baseDto });

      const result = await service.create(baseDto);

      expect(result.id).toBe(5);
      expect(paymentRepo.save).toHaveBeenCalled();
    });

    it('lanza NotFound si carrito no existe', async () => {
      cartRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({ ...baseDto, carritoId: 99 })
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza NotFound si usuario no existe', async () => {
      cartRepo.findOne.mockResolvedValue({
        idCart: 1,
        usuario: { id: 1 },
      });

      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({ ...baseDto, usuarioId: 99 })
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza BadRequest si carrito NO pertenece al usuario', async () => {
      cartRepo.findOne.mockResolvedValue({
        idCart: 1,
        usuario: { id: 2 }, // distinto usuario
      });

      userRepo.findOne.mockResolvedValue({ id: 1 });

      await expect(service.create(baseDto)).rejects.toThrow(BadRequestException);
    });

    it('lanza BadRequest si save falla', async () => {
      cartRepo.findOne.mockResolvedValue({
        idCart: 1,
        usuario: { id: 1 },
      });

      userRepo.findOne.mockResolvedValue({ id: 1 });

      paymentRepo.save.mockRejectedValue(new Error('DB error'));

      await expect(service.create(baseDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll()', () => {
    it('devuelve todos los pagos', async () => {
      paymentRepo.find.mockResolvedValue([]);

      expect(await service.findAll()).toEqual([]);
    });
  });

  describe('findOne()', () => {
    it('devuelve un pago existente', async () => {
      paymentRepo.findOne.mockResolvedValue({ id: 1 });

      expect(await service.findOne(1)).toEqual({ id: 1 });
    });

    it('lanza NotFound si no existe', async () => {
      paymentRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('actualiza un pago', async () => {
      paymentRepo.findOne.mockResolvedValue({ id: 1, monto: 10 });

      paymentRepo.save.mockResolvedValue({ id: 1, monto: 20 });

      const result = await service.update(1, { monto: 20 });

      expect(result.monto).toBe(20);
    });

    it('lanza NotFound si no existe', async () => {
      paymentRepo.findOne.mockResolvedValue(null);

      await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePatch()', () => {
    it('actualiza parcialmente', async () => {
      paymentRepo.findOne.mockResolvedValue({ id: 1, estado: EstadoPago.PENDIENTE });

      paymentRepo.save.mockResolvedValue({ id: 1, estado: EstadoPago.COMPLETADO });

      const result = await service.updatePatch(1, { estado: EstadoPago.COMPLETADO });

      expect(result.estado).toBe(EstadoPago.COMPLETADO);
    });

    it('lanza NotFound si no existe', async () => {
      paymentRepo.findOne.mockResolvedValue(null);

      await expect(service.updatePatch(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('elimina correctamente', async () => {
      paymentRepo.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.not.toThrow();
    });

    it('lanza NotFound si no elimina nada', async () => {
      paymentRepo.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser()', () => {
    it('busca correctamente por usuario', async () => {
      paymentRepo.find.mockResolvedValue([{ id: 1 }]);

      const result = await service.findByUser(10);

      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('findByCart()', () => {
    it('busca correctamente por carrito', async () => {
      paymentRepo.find.mockResolvedValue([{ id: 2 }]);

      const result = await service.findByCart(99);

      expect(result).toEqual([{ id: 2 }]);
    });
  });
});
