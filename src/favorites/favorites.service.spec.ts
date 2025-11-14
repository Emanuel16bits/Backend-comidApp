import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let repo: jest.Mocked<Repository<Favorite>>;

  beforeEach(async () => {
    const repoMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: getRepositoryToken(Favorite), useValue: repoMock },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    repo = module.get(getRepositoryToken(Favorite));
  });

  it('debería obtener todos los favoritos', async () => {
    const favoritos = [{ id: 1 }] as any;
    repo.find.mockResolvedValue(favoritos);

    const result = await service.obtenerTodos();
    expect(result).toEqual(favoritos);
    expect(repo.find).toHaveBeenCalledWith({
      relations: ['usuario', 'producto'],
    });
  });

  it('debería obtener favoritos por usuario', async () => {
    const favoritos = [{ id: 1 }] as any;
    repo.find.mockResolvedValue(favoritos);

    const result = await service.obtenerPorUsuario(5);
    expect(result).toEqual(favoritos);

    expect(repo.find).toHaveBeenCalledWith({
      where: { usuario: { id: 5 } },
      relations: ['producto'],
    });
  });

  it('debería agregar un favorito', async () => {
    const user = { id: 10 } as any;
    const product = { id: 20 } as any;
    const entity = { id: 1, usuario: user, producto: product } as any;

    repo.create.mockReturnValue(entity);
    repo.save.mockResolvedValue(entity);

    const result = await service.agregarFavorito(user, product);

    expect(repo.create).toHaveBeenCalledWith({ usuario: user, producto: product });
    expect(repo.save).toHaveBeenCalledWith(entity);
    expect(result).toEqual(entity);
  });

  it('debería eliminar un favorito', async () => {
    const favorito = { id: 99 } as any;

    repo.findOne.mockResolvedValue(favorito);
    repo.remove.mockResolvedValue({ id: 99 } as any);


    await expect(service.eliminarFavorito(1, 2)).resolves.not.toThrow();
    expect(repo.findOne).toHaveBeenCalledWith({
      where: {
        usuario: { id: 1 },
        producto: { id: 2 },
      },
      relations: ['usuario', 'producto'],
    });

    expect(repo.remove).toHaveBeenCalledWith(favorito);
  });

  it('debería tirar error si el favorito no existe al borrar', async () => {
    repo.findOne.mockResolvedValue(null);


    await expect(service.eliminarFavorito(1, 2))
      .rejects
      .toThrow(NotFoundException);
  });
});
