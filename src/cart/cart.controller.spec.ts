import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { BadRequestException } from '@nestjs/common';

describe('CartController', () => {
  let controller: CartController;
  let service: jest.Mocked<CartService>;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [{ provide: CartService, useValue: serviceMock }],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get(CartService) as any;
  });

  it('debería crear un carrito', async () => {
    const dto = { usuarioId: 1 };
    const cart = { idCart: 1 };

    service.create.mockResolvedValue(cart as any);

    const result = await controller.create(dto);
    expect(result).toEqual(cart);
  });

  it('debería tirar error si el id no es válido', async () => {
    await expect(controller.findOne('abc')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('debería retornar un carrito por id', async () => {
    const cart = { idCart: 1 };

    service.findOne.mockResolvedValue(cart as any);

    const result = await controller.findOne('1');
    expect(result).toEqual(cart);
  });

  it('debería actualizar un carrito con PATCH', async () => {
    const dto = { total: 100 };
    const cart = { idCart: 1 };

    service.update.mockResolvedValue(cart as any);

    const result = await controller.update('1', dto);
    expect(result).toEqual(cart);
  });

  it('debería actualizar un carrito con PUT', async () => {
    const dto = { total: 50 };
    const cart = { idCart: 1 };

    service.update.mockResolvedValue(cart as any);

    const result = await controller.updatePut('1', dto);
    expect(result).toEqual(cart);
  });

  it('debería eliminar un carrito', async () => {
    service.remove.mockResolvedValue(undefined);

    const result = await controller.remove('1');
    expect(result).toBeUndefined();
  });
});



