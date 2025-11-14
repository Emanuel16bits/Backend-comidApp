import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;

  let restaurantService: jest.Mocked<any>;
  let usersService: jest.Mocked<any>;

  beforeEach(async () => {
    restaurantService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    usersService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        { provide: RestaurantsService, useValue: restaurantService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
  });

  it('debería crear un restaurante', async () => {
    const dto = {
      nombre: 'Pizza Loca',
      direccion: 'Calle 123',
      categoria: 'Pizzas',
      descripcion: '',
      horarioApertura: '08:00',
      horarioCierre: '22:00',
      activo: true,
      idUsuario: 1,
    };

    usersService.findOne.mockResolvedValue({ id: 1 });
    restaurantService.create.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(dto);

    expect(result.id).toBe(1);
  });

  it('debería lanzar error si el usuario no existe', async () => {
    usersService.findOne.mockResolvedValue(null);

    const dto = {
      nombre: 'Pizza Loca',
      direccion: 'Calle 123',
      categoria: 'Pizzas',
      descripcion: '',
      horarioApertura: '08:00',
      horarioCierre: '22:00',
      activo: true,
      idUsuario: 99,
    };

    await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('debería retornar todos los restaurantes', async () => {
    restaurantService.findAll.mockResolvedValue([]);

    const result = await controller.findAll();

    expect(result).toEqual([]);
  });

  it('debería retornar uno por id', async () => {
    restaurantService.findOne.mockResolvedValue({ id: 1 });

    const result = await controller.findOne('1');

    expect(result).toEqual({ id: 1 });
  });

  it('debería actualizar un restaurante', async () => {
    restaurantService.update.mockResolvedValue({ id: 1, nombre: 'Nuevo' });

    const result = await controller.update('1', { nombre: 'Nuevo' });

    expect(result.nombre).toBe('Nuevo');
  });

  it('debería eliminar un restaurante', async () => {
    restaurantService.remove.mockResolvedValue(undefined);

    await expect(controller.remove('1')).resolves.not.toThrow();
  });
});
