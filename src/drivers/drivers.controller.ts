// Update the imports at the top
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}


  @Patch('user/:userId/vehiculo')
  async actualizarVehiculoPorUsuario(
    @Param('userId') userId: number,
    @Body() vehiculoData: any,
  ): Promise<Driver> {
    console.log(
      `Solicitud de actualización de vehículo para usuario ID: ${userId}`,
    );
    console.log('Datos recibidos:', vehiculoData);

    try {
      const driver = await this.driversService.actualizarVehiculo(
        userId,
        vehiculoData,
      );
      console.log('Vehículo actualizado con éxito:', driver);
      return driver;
    } catch (error) {
      console.error('Error en el controlador:', error);
      throw error;
    }
  }

    @Get('user/:userId/vehicles')
  async getDriverVehicles(@Param('userId') userId: string) {
    try {
      console.log(`Buscando vehículos para el usuario ID: ${userId}`);
      const driver = await this.driversService.findByUserId(Number(userId));

      if (!driver) {
        console.log(`No se encontró el conductor con userId: ${userId}`);
        throw new NotFoundException(
          `No se encontró el conductor con userId: ${userId}`,
        );
      }

      // Devolver solo la información del vehículo
      return {
        id: driver.id,
        tipoVehiculo: driver.tipoVehiculo,
        placa: driver.placa,
        marca: driver.marca,
        modelo: driver.modelo,
        color: driver.color,
        anio: driver.anio,
      };
    } catch (error) {
      console.error('Error en el controlador al obtener vehículos:', error);
      throw error;
    }
  }

  @Get()
  GetAll(): Promise<Driver[]> {
    return this.driversService.GetAll();
  }

  @Get(':id')
  GetOne(@Param('id') id: number): Promise<Driver> {
    return this.driversService.GetOne(id);
  }

  @Post()
  async crear(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
    try {
      // Ensure default values are set
      const driverData = {
        ...createDriverDto,
        disponible: createDriverDto.disponible ?? true, // Default to true if not provided
        calificacion: createDriverDto.calificacion ?? 0,
        gananciasTotales: createDriverDto.gananciasTotales ?? 0,
      };
      return await this.driversService.create(driverData);
    } catch (error: any) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Patch(':id/disponibilidad')
  actualizarDisponibilidad(
    @Param('id') id: number,
    @Body('disponible') disponible: boolean,
  ): Promise<Driver> {
    return this.driversService.actualizarDisponibility(id, disponible);
  }

  @Patch(':id/ganancias')
  actualizarGanancias(
    @Param('id') id: number,
    @Body('monto') monto: number,
  ): Promise<Driver> {
    return this.driversService.actualizarGanancias(id, monto);
  }

  @Patch(':id/calificacion')
  actualizarCalificacion(
    @Param('id') id: number,
    @Body('calificacion') calificacion: number,
  ): Promise<Driver> {
    return this.driversService.actualizarCalificacion(id, calificacion);
  }



}
