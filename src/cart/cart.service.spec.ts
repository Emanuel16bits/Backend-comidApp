import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let cartRepo: jest.Mocked<any>;
  let cartItemRepo: jest.Mocked<any>;

  beforeEach(async () => {
    cartRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    cartItemRepo = {
      create: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: cartRepo,
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: cartItemRepo,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('debería crear un carrito', async () => {
    const dto = { usuarioId: 1 };
    const cart = { idCart: 1, usuarioId: 1 };

    cartRepo.create.mockReturnValue(cart);
    cartRepo.save.mockResolvedValue(cart);

    const result = await service.create(dto);
    expect(result).toEqual(cart);
  });

  it('debería retornar todos los carritos', async () => {
    cartRepo.find.mockResolvedValue([]);

    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('debería obtener un carrito por id', async () => {
    const cart = { idCart: 1, items: [] };
    cartRepo.findOne.mockResolvedValue(cart);

    const result = await service.findOne(1);
    expect(result).toEqual(cart);
  });

  it('debería lanzar error si el carrito no existe', async () => {
    cartRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar un carrito', async () => {
    const cart = { idCart: 1, total: 0, activo: true, items: [] };
    cartRepo.findOne.mockResolvedValue(cart);
    cartItemRepo.delete.mockResolvedValue(undefined);
    cartRepo.save.mockResolvedValue(cart);

    const dto = { total: 200 };

    const result = await service.update(1, dto);
    expect(result).toEqual(cart);
  });

  it('debería eliminar un carrito', async () => {
    const cart = { idCart: 1 };
    cartRepo.findOne.mockResolvedValue(cart);
    cartRepo.remove.mockResolvedValue(undefined);

    await expect(service.remove(1)).resolves.toBeUndefined();
  });
});
