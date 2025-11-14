import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let favoritesService: jest.Mocked<FavoritesService>;
  let usersService: jest.Mocked<UsersService>;
  let productsService: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        { provide: FavoritesService, useValue: { 
            obtenerTodos: jest.fn(),
            obtenerPorUsuario: jest.fn(),
            agregarFavorito: jest.fn(),
            eliminarFavorito: jest.fn(),
        }},
        { provide: UsersService, useValue: { findOne: jest.fn() }},
        { provide: ProductsService, useValue: { findOne: jest.fn() }},
      ],
    }).compile();

    controller = module.get(FavoritesController);
    favoritesService = module.get(FavoritesService);
    usersService = module.get(UsersService);
    productsService = module.get(ProductsService);
  });

  it('debería obtener todos los favoritos', async () => {
    favoritesService.obtenerTodos.mockResolvedValue([]);

    const result = await controller.obtenerTodos();
    expect(result).toEqual([]);
  });

  it('debería obtener favoritos por usuario', async () => {
    const favorites = [{ id: 1 }] as any;
    favoritesService.obtenerPorUsuario.mockResolvedValue(favorites);

    const result = await controller.obtenerPorUsuario(1);
    expect(result).toEqual(favorites);
  });

  it('debería agregar un favorito', async () => {
    const user = { id: 1 } as any;
    const product = { id: 10 } as any;
    const fav = { id: 99 } as any;

    usersService.findOne.mockResolvedValue(user);
    productsService.findOne.mockResolvedValue(product);
    favoritesService.agregarFavorito.mockResolvedValue(fav);

    const result = await controller.agregarFavorito(1, 10);

    expect(result).toEqual(fav);
    expect(usersService.findOne).toHaveBeenCalledWith(1);
    expect(productsService.findOne).toHaveBeenCalledWith(10);
    expect(favoritesService.agregarFavorito).toHaveBeenCalledWith(user, product);
  });

  it('debería eliminar un favorito', async () => {
    favoritesService.eliminarFavorito.mockResolvedValue(undefined);

    const result = await controller.eliminarFavorito(1, 10);
    expect(result).toBeUndefined();
    expect(favoritesService.eliminarFavorito).toHaveBeenCalledWith(1, 10);
  });
});
