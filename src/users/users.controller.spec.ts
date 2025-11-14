import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;
  let restaurantsService: jest.Mocked<RestaurantsService>;

  beforeEach(async () => {
    const usersServiceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const restaurantsServiceMock = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: RestaurantsService, useValue: restaurantsServiceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService) as any;
    restaurantsService = module.get(RestaurantsService) as any;
  });

  it('debería obtener todos los usuarios', async () => {
    const users = [{ id: 1 }, { id: 2 }];
    usersService.findAll.mockResolvedValue(users as any);

    const result = await controller.getAll();
    expect(result.success).toBe(true);
    expect(result.data).toEqual(users);
  });

  it('debería obtener un usuario por id', async () => {
    const user = { id: 1 };
    usersService.findOne.mockResolvedValue(user as any);

    const result = await controller.getById('1');
    expect(result.success).toBe(true);
    expect(result.data).toEqual(user);
  });

  it('debería crear un usuario sin restaurante', async () => {
    const dto = {
      nombre: 'Juan',
      email: 'test@test.com',
      password: '123456',
      rol: 'cliente',
    };

    usersService.create.mockResolvedValue({ id: 1 } as any);

    const result = await controller.create(dto as any);

    expect(result.success).toBe(true);
    expect(result.data!.userId).toBe(1);
    expect(result.data!.restaurantId).toBeUndefined();
  });

  it('debería crear un usuario vendedor con restaurante', async () => {
    const dto = {
      nombre: 'Ana',
      email: 'ana@test.com',
      password: '123456',
      rol: 'vendedor',
      restaurante: {
        nombre: 'Resto Loco',
        direccion: 'Calle 123',
        categoria: 'Parrilla',
      },
    };

    usersService.create.mockResolvedValue({ id: 10 } as any);
    restaurantsService.create.mockResolvedValue({ id: 5 } as any);

    const result = await controller.create(dto as any);

    expect(result.success).toBe(true);
    expect(result.data!.userId).toBe(10);        // ✅ ID correcto
    expect(result.data!.restaurantId).toBe(5);  // ✅ ID esperado de tu mock
  });

  it('debería actualizar un usuario con PUT', async () => {
    const dto = { nombre: 'Nuevo' };
    const updated = { id: 1, nombre: 'Nuevo' };

    usersService.update.mockResolvedValue(updated as any);

    const result = await controller.update('1', dto as any);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(updated);
  });

  it('debería actualizar un usuario con PATCH', async () => {
    const dto = { email: 'nuevo@test.com' };
    const updated = { id: 1, email: 'nuevo@test.com' };

    usersService.update.mockResolvedValue(updated as any);

    const result = await controller.partialUpdate('1', dto as any);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(updated);
  });

  it('debería eliminar un usuario', async () => {
    usersService.remove.mockResolvedValue({ message: 'Usuario eliminado' } as any);

    const result = await controller.delete('1');
    expect(result.success).toBe(true);
  });
});
