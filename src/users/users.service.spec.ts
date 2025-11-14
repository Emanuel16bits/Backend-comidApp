import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<any>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('debería crear un usuario', async () => {
    const dto: {
      nombre: string;
      email: string;
      password: string;
      rol: 'cliente';
    } = {
      nombre: 'Juan',
      email: 'a@a.com',
      password: '123456',
      rol: 'cliente',
    };

    repo.create.mockReturnValue(dto);
    repo.save.mockResolvedValue({ id: 1, ...dto });

    const result = await service.create(dto);
    expect(result.id).toBe(1);
  });

  it('debería retornar todos los usuarios', async () => {
    repo.find.mockResolvedValue([]);

    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('debería retornar un usuario por id', async () => {
    repo.findOneBy.mockResolvedValue({ id: 1 });

    const result = await service.findOne(1);

    expect(result).toEqual({ id: 1 });
  });

  it('debería lanzar error si usuario no existe', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar un usuario', async () => {
    repo.findOneBy.mockResolvedValue({ id: 1, nombre: 'Viejo' });
    repo.save.mockResolvedValue({ id: 1, nombre: 'Nuevo' });

    const result = await service.update(1, { nombre: 'Nuevo' });

    expect(result.nombre).toBe('Nuevo');
  });

  it('debería eliminar un usuario', async () => {
    repo.findOneBy.mockResolvedValue({ id: 1 });
    repo.remove.mockResolvedValue(undefined);

    const result = await service.remove(1);

    expect(result.message).toContain('eliminado');
  });
});
