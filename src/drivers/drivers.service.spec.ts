import { Test, TestingModule } from '@nestjs/testing';
import { DriversService } from './drivers.service';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('DriversService', () => {
  let service: DriversService;
  let repo: jest.Mocked<Repository<Driver>>;

  beforeEach(async () => {
    const repoMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriversService,
        { provide: getRepositoryToken(Driver), useValue: repoMock },
      ],
    }).compile();

    service = module.get<DriversService>(DriversService);
    repo = module.get(getRepositoryToken(Driver));
  });

  it('debería retornar todos los drivers', async () => {
    const drivers = [{ id: 1 }] as any;
    repo.find.mockResolvedValue(drivers);

    const result = await service.obtenerTodos();
    expect(result).toEqual(drivers);
  });

  it('debería retornar un driver por id', async () => {
    const driver = { id: 1 } as any;
    repo.findOne.mockResolvedValue(driver);

    const result = await service.obtenerUno(1);
    expect(result).toEqual(driver);
  });

  it('debería tirar error si el driver no existe', async () => {
    repo.findOne.mockResolvedValue(null);


    await expect(service.obtenerUno(1)).rejects.toThrow(NotFoundException);
  });

  it('debería crear un driver', async () => {
    const dto = { nombre: 'Juan' };
    const driver = { id: 1 } as any;

    repo.create.mockReturnValue(driver);
    repo.save.mockResolvedValue(driver);

    const result = await service.crear(dto);
    expect(result).toEqual(driver);
  });

  it('debería actualizar disponibilidad', async () => {
    const driver = { id: 1, disponible: false } as any;

    jest.spyOn(service, 'obtenerUno').mockResolvedValue(driver);
    repo.save.mockResolvedValue({ ...driver, disponible: true });

    const result = await service.actualizarDisponibilidad(1, true);
    expect(result.disponible).toBe(true);
  });

  it('debería sumar ganancias', async () => {
    const driver = { id: 1, gananciasTotales: 100 } as any;

    jest.spyOn(service, 'obtenerUno').mockResolvedValue(driver);
    repo.save.mockResolvedValue({ ...driver, gananciasTotales: 150 });

    const result = await service.actualizarGanancias(1, 50);
    expect(result.gananciasTotales).toBe(150);
  });

  it('debería actualizar calificación', async () => {
    const driver = { id: 1, calificacion: 3 } as any;

    jest.spyOn(service, 'obtenerUno').mockResolvedValue(driver);
    repo.save.mockResolvedValue({ ...driver, calificacion: 5 });

    const result = await service.actualizarCalificacion(1, 5);
    expect(result.calificacion).toBe(5);
  });
});
