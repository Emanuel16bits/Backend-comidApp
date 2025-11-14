import { Test, TestingModule } from '@nestjs/testing';
import { CartItemService } from './cart-item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from '../products/entities/product.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CartItemService', () => {
  let service: CartItemService;

  let cartItemRepo: any;
  let cartRepo: any;
  let productRepo: any;

  beforeEach(async () => {
  cartItemRepo = {
    findOne: jest.fn(),
    find: jest.fn().mockResolvedValue([]), // <<<<<<<<<<<<<<<<<<<<<<<<<< FIX
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  cartRepo = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  productRepo = {
    findOne: jest.fn(),
  };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        { provide: getRepositoryToken(CartItem), useValue: cartItemRepo },
        { provide: getRepositoryToken(Cart), useValue: cartRepo },
        { provide: getRepositoryToken(Product), useValue: productRepo },
      ],
    }).compile();

    service = module.get<CartItemService>(CartItemService);
  });

  // CREATE
  it('debería crear un nuevo cart-item', async () => {
    const dto = {
      idCart: 1,
      idProducto: 2,
      cantidad: 3,
      precioUnitario: 10,
    };

    cartRepo.findOne.mockResolvedValue({ idCart: 1 });
    productRepo.findOne.mockResolvedValue({ idProduct: 2 });
    cartItemRepo.findOne.mockResolvedValue(null);

    const created = { id: 1 };
    cartItemRepo.create.mockReturnValue(created);
    cartItemRepo.save.mockResolvedValue(created);

    const result = await service.create(dto);
    expect(result).toEqual(created);
  });

  it('debería sumar cantidad si el item ya existe', async () => {
    const dto = {
      idCart: 1,
      idProducto: 2,
      cantidad: 3,
      precioUnitario: 10,
    };

    cartRepo.findOne.mockResolvedValue({ idCart: 1 });
    productRepo.findOne.mockResolvedValue({ idProduct: 2 });

    const existente = {
      id: 99,
      cantidad: 1,
      precioUnitario: 5,
    };

    cartItemRepo.findOne.mockResolvedValue(existente);
    cartItemRepo.save.mockResolvedValue(existente);

    const result = await service.create(dto);

    expect(result.cantidad).toBe(4);
    expect(result.precioUnitario).toBe(10);
  });

  it('debería tirar error si el carrito no existe', async () => {
    cartRepo.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        idCart: 9,
        idProducto: 1,
        cantidad: 1,
        precioUnitario: 10,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('debería tirar error si el producto no existe', async () => {
    cartRepo.findOne.mockResolvedValue({ idCart: 1 });
    productRepo.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        idCart: 1,
        idProducto: 99,
        cantidad: 1,
        precioUnitario: 10,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  // FIND ALL
  it('debería retornar todos los items', async () => {
    const items = [{ id: 1 }, { id: 2 }];
    cartItemRepo.find.mockResolvedValue(items);

    const result = await service.findAll();
    expect(result).toEqual(items);
  });

  // FIND ONE
  it('debería retornar un item por id', async () => {
    const item = { id: 1 };
    cartItemRepo.findOne.mockResolvedValue(item);

    const result = await service.findOne(1);
    expect(result).toEqual(item);
  });

  it('debería tirar error si el item no existe', async () => {
    cartItemRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  // UPDATE
  it('debería actualizar un item', async () => {
    const item = {
      id: 1,
      carritoId: 1,
      productoId: 1,
      cantidad: 1,
      precioUnitario: 10,
      carrito: {},
      producto: {},
    };

    cartItemRepo.findOne.mockResolvedValue(item);
    cartItemRepo.save.mockResolvedValue(item);

    const result = await service.update(1, { cantidad: 5 });
    expect(result.cantidad).toBe(5);
  });

  it('debería tirar error si la cantidad es inválida', async () => {
    const item = {
      id: 1,
      carritoId: 1,
      productoId: 1,
      cantidad: 1,
      precioUnitario: 10,
      carrito: {},
      producto: {},
    };

    cartItemRepo.findOne.mockResolvedValue(item);

    await expect(
      service.update(1, { cantidad: 0 }),
    ).rejects.toThrow(BadRequestException);
  });

  // DELETE
  it('debería eliminar un item', async () => {
    const item = { id: 1, carritoId: 1 };
    cartItemRepo.findOne.mockResolvedValue(item);

    cartItemRepo.remove.mockResolvedValue(undefined);

    await expect(service.remove(1)).resolves.not.toThrow();
  });
});
