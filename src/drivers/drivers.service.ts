import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { UsersService } from '../users/users.service';
import { CreateDriverDtoType } from './dto/create-driver.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private repositorioDrivers: Repository<Driver>,
    private usersService: UsersService,
  ) {}

  async GetAll(): Promise<Driver[]> {
    return this.repositorioDrivers.find();
  }

  async GetOne(id: number): Promise<Driver> {
    const driver = await this.repositorioDrivers.findOne({ where: { id } });
    if (!driver) throw new NotFoundException('Driver no encontrado');
    return driver;
  }

  async create(createDriverDto: CreateDriverDtoType): Promise<Driver> {
  // Si ya existe un driver para ese email o userId, no lo crees de nuevo
  const existingDriver = await this.repositorioDrivers.findOne({
    where: [{ email: createDriverDto.email }],
  });

  if (existingDriver) {
    throw new ConflictException('El conductor ya existe en el sistema');
  }

  // Si no existe, crear nuevo user y driver
  const userData = {
    nombre: createDriverDto.nombre,
    email: createDriverDto.email,
    password: createDriverDto.password || 'passwordTemporal',
    rol: 'repartidor' as const,
  };

  try {
    const user = await this.usersService.create(userData);

    const driver = new Driver();
    driver.user = user;
    driver.userId = user.id;
    driver.nombre = createDriverDto.nombre;
    driver.email = createDriverDto.email;
    driver.telefono = createDriverDto.telefono || null;
    driver.tipoVehiculo = null;
    driver.placa = null;
    driver.marca = null;
    driver.modelo = null;
    driver.color = null;
    driver.anio = null;
    driver.disponible = true;
    driver.calificacion = 0;
    driver.gananciasTotales = 0;

    return await this.repositorioDrivers.save(driver);
  } catch (error) {
    if (error instanceof Error) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }
    throw error;
  }
}


  async actualizarDisponibility(
    id: number,
    disponible: boolean,
  ): Promise<Driver> {
    const driver = await this.GetOne(id);
    driver.disponible = disponible;
    return this.repositorioDrivers.save(driver);
  }

  async actualizarGanancias(id: number, monto: number): Promise<Driver> {
    const driver = await this.GetOne(id);
    driver.gananciasTotales += monto;
    return this.repositorioDrivers.save(driver);
  }

  async actualizarCalificacion(
    id: number,
    calificacion: number,
  ): Promise<Driver> {
    const driver = await this.GetOne(id);
    driver.calificacion = calificacion;
    return this.repositorioDrivers.save(driver);
  }

  async findByUserId(userId: number): Promise<Driver> {
    try {
      console.log(`Buscando conductor con userId: ${userId}`);
      const driver = await this.repositorioDrivers.findOne({
        where: { userId },
        select: [
          'id',
          'tipoVehiculo',
          'placa',
          'marca',
          'modelo',
          'color',
          'anio',
        ],
      });

      if (!driver) {
        throw new NotFoundException(
          `No se encontró el conductor con userId: ${userId}`,
        );
      }

      return driver;
    } catch (error) {
      console.error('Error en findByUserId:', error);
      throw error;
    }
  }

  async actualizarVehiculo(
    userId: number,
    vehiculoData: {
      tipoVehiculo?: string;
      placa?: string;
      marca?: string;
      modelo?: string;
      color?: string;
      anio?: number;
    },
  ): Promise<Driver> {
    try {
      console.log(`Buscando conductor con userId: ${userId}`);
      const driver = await this.repositorioDrivers.findOne({
        where: { userId },
      });

      if (!driver) {
        console.log(`No se encontró el conductor con userId: ${userId}`);
        throw new NotFoundException(
          `No se encontró el conductor con userId: ${userId}`,
        );
      }

      console.log('Datos del vehículo recibidos:', vehiculoData);

      // Actualizar solo los campos proporcionados
      if (vehiculoData.tipoVehiculo !== undefined)
        driver.tipoVehiculo = vehiculoData.tipoVehiculo;
      if (vehiculoData.placa !== undefined) driver.placa = vehiculoData.placa;
      if (vehiculoData.marca !== undefined) driver.marca = vehiculoData.marca;
      if (vehiculoData.modelo !== undefined)
        driver.modelo = vehiculoData.modelo;
      if (vehiculoData.color !== undefined) driver.color = vehiculoData.color;
      if (vehiculoData.anio !== undefined) driver.anio = vehiculoData.anio;

      console.log('Guardando cambios del vehículo...');
      const updatedDriver = await this.repositorioDrivers.save(driver);
      console.log('Vehículo actualizado correctamente:', updatedDriver);

      return updatedDriver;
    } catch (error) {
      console.error('Error en actualizarVehiculo:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al actualizar el vehículo');
    }
  }
}
