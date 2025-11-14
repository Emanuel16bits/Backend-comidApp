import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  obtenerTodos() {
    return this.favoritesService.obtenerTodos();
  }

  @Get(':usuarioId')
  obtenerPorUsuario(@Param('usuarioId') usuarioId: number) {
    return this.favoritesService.obtenerPorUsuario(usuarioId);
  }

  @Post(':usuarioId/:productoId')
  async agregarFavorito(
    @Param('usuarioId') usuarioId: number,
    @Param('productoId') productoId: number,
  ) {
    const usuario = await this.usersService.findOne(usuarioId);
    const producto = await this.productsService.findOne(productoId);
    return this.favoritesService.agregarFavorito(usuario, producto);
  }

  @Delete(':usuarioId/:productoId')
  eliminarFavorito(
    @Param('usuarioId') usuarioId: number,
    @Param('productoId') productoId: number,
  ) {
    return this.favoritesService.eliminarFavorito(usuarioId, productoId);
  }
}
