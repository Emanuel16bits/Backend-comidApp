import { Test, TestingModule } from '@nestjs/testing';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CartItemController', () => {
  let controller: CartItemController;
  let service: jest.Mocked<CartItemService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemController],
      providers: [{ provide: CartItemService, useValue: mockService }],
    }).compile();

    controller = module.get<CartItemController>(CartItemController);
    service = module.get(CartItemService) as any;
  });

  it('debería crear un cart-item', async () => {
    const dto = {
      idCart: 1,
      idProducto: 2,
      cantidad: 3,
      precioUnitario: 10,
    };

    const item = { id: 1 };

    service.create.mockResolvedValue(item as any);

    const result = await controller.create(dto);
    expect(result).toEqual(item);
  });

  it('debería tirar error si findAll no tiene ítems', async () => {
    service.findAll.mockResolvedValue([]);

    await expect(controller.findAll()).rejects.toThrow(NotFoundException);
  });

  it('debería retornar todos los cart-items', async () => {
    const items = [{ id: 1 }, { id: 2 }];
    service.findAll.mockResolvedValue(items as any);

    const result = await controller.findAll();
    expect(result).toEqual(items);
  });

  it('debería retornar un ítem por id', async () => {
    const item = { id: 1 };
    service.findOne.mockResolvedValue(item as any);

    const result = await controller.findOne('1');
    expect(result).toEqual(item);
  });

  it('debería tirar error si el id es inválido en findOne', async () => {
    await expect(controller.findOne('abc')).rejects.toThrow(BadRequestException);
  });

  it('debería actualizar un cart-item con PUT', async () => {
    const dto = { cantidad: 5 };
    const item = { id: 1 };

    service.update.mockResolvedValue(item as any);

    const result = await controller.updatePut('1', dto);
    expect(result).toEqual(item);
  });

  it('debería actualizar un cart-item con PATCH', async () => {
    const dto = { cantidad: 2 };
    const item = { id: 1 };

    service.update.mockResolvedValue(item as any);

    const result = await controller.update('1', dto);
    expect(result).toEqual(item);
  });

  it('debería eliminar un ítem', async () => {
    service.remove.mockResolvedValue(undefined);

    const result = await controller.remove('1');
    expect(result).toBeUndefined();
  });
});

