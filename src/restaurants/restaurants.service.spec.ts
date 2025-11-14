import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let restaurantRepo: jest.Mocked<any>;
  let usersService: jest.Mocked<any>;

  beforeEach(async () => {
    restaurantRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    usersService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        { provide: getRepositoryToken(Restaurant), useValue: restaurantRepo },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
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

    const restaurant = { id: 1, ...dto };

    restaurantRepo.create.mockReturnValue(restaurant);
    restaurantRepo.save.mockResolvedValue(restaurant);

    const result = await service.create(dto);

    expect(result).toEqual(restaurant);
  });

  it('debería retornar todos los restaurantes', async () => {
    restaurantRepo.find.mockResolvedValue([]);

    const result = await service.findAll();

    expect(result).toEqual([]);
  });

  it('debería obtener un restaurante por id', async () => {
    const restaurant = { id: 1 };

    restaurantRepo.findOne.mockResolvedValue(restaurant);

    const result = await service.findOne(1);

    expect(result).toEqual(restaurant);
  });

  it('debería lanzar error si el restaurante no existe', async () => {
    restaurantRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar un restaurante', async () => {
    const restaurant = { id: 1, nombre: 'Viejo' };

    restaurantRepo.findOne.mockResolvedValue(restaurant);
    restaurantRepo.save.mockResolvedValue({ id: 1, nombre: 'Nuevo' });

    const result = await service.update(1, { nombre: 'Nuevo' });

    expect(result.nombre).toBe('Nuevo');
  });

  it('debería eliminar un restaurante', async () => {
    restaurantRepo.delete.mockResolvedValue({ affected: 1 });

    await expect(service.remove(1)).resolves.not.toThrow();
  });

  it('debería lanzar error si no se elimina nada', async () => {
    restaurantRepo.delete.mockResolvedValue({ affected: 0 });

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });
});
