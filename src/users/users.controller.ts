import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RestaurantsService } from '../restaurants/restaurants.service';

type UserRole = 'cliente' | 'vendedor' | 'repartidor';

interface CreateUserDto {
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
  restaurante?: {
    nombre: string;
    direccion: string;
    categoria: string;
    descripcion?: string;
    activo?: boolean;
    horarioApertura?: string;
    horarioCierre?: string;
    imagenUrl?: string;
  };
}

interface CreateRestaurantDto {
  nombre: string;
  direccion: string;
  categoria: string;
  descripcion: string;
  idUsuario: number;
  activo: boolean;
  horarioApertura: string;
  horarioCierre: string;
  imagenUrl: string;
}

interface UpdateUserDto {
  nombre?: string;
  email?: string;
  password?: string;
  rol?: UserRole;
}

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private restaurantsService: RestaurantsService,
  ) {}

  @Get()
  async getAll() {
    try {
      const users = await this.usersService.findAll();
      return { success: true, data: users };
    } catch (error) {
      return {
        success: false,
        message: 'Error',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(+id);
      if (!user) {
        return { success: false, message: 'Usuario no encontrado' };
      }
      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        message: 'Error',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    try {
      console.log('Body:', JSON.stringify(body, null, 2));
      if (!body.nombre || !body.email || !body.password || !body.rol) {
        return {
          success: false,
          message: 'Faltan campos como: nombre, email, password, rol',
        };
      }

      const rolesValidos: UserRole[] = ['cliente', 'vendedor', 'repartidor'];
      if (!rolesValidos.includes(body.rol)) {
        return {
          success: false,
          message: 'Rol invalido, debe ser: cliente, vendedor o repartidor',
        };
      }

      const user = await this.usersService.create({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        rol: body.rol,
      });

      console.log('Usuario creado con id:', user.id);

      if (body.rol === 'vendedor' && body.restaurante) {
        const restauranteData = body.restaurante;

        console.log('Datos del restaurante:', restauranteData);
        if (
          !restauranteData.nombre ||
          !restauranteData.direccion ||
          !restauranteData.categoria
        ) {
          return {
            success: false,
            message:
              'Faltan datos del restaurante como: nombre, direccion o categoria',
          };
        }

        const restaurantToCreate: CreateRestaurantDto = {
          nombre: restauranteData.nombre,
          direccion: restauranteData.direccion,
          categoria: restauranteData.categoria,
          descripcion: restauranteData.descripcion ?? '',
          idUsuario: user.id,
          activo: restauranteData.activo ?? true,
          horarioApertura: restauranteData.horarioApertura ?? '08:00',
          horarioCierre: restauranteData.horarioCierre ?? '22:00',
          imagenUrl: restauranteData.imagenUrl ?? '',
        };

        console.log(
          'Datos finales para crear restaurante:',
          restaurantToCreate,
        );

        const restaurant =
          await this.restaurantsService.create(restaurantToCreate);

        console.log('Restaurante creado con id:', restaurant.id);

        return {
          success: true,
          message: 'Usuario y restaurante creados correctamente',
          data: {
            userId: user.id,
            restaurantId: restaurant.id,
            user: user,
            restaurant: restaurant,
          },
        };
      }

      return {
        success: true,
        message: 'Usuario creado',
        data: {
          userId: user.id,
          user: user,
        },
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return {
        success: false,
        message: 'Error al crear el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    try {
      const updated = await this.usersService.update(+id, body);
      return {
        success: true,
        message: 'Usuario actualizado',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  @Patch(':id')
  async partialUpdate(@Param('id') id: string, @Body() body: UpdateUserDto) {
    try {
      const updated = await this.usersService.update(+id, body);
      return {
        success: true,
        message: 'Usuario actualizado parcialmente',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.usersService.remove(+id);
      return {
        success: true,
        message: 'Usuario eliminado',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}
