import { Test, TestingModule } from '@nestjs/testing';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';

describe('DriversController', () => {
  let controller: DriversController;
  let service: jest.Mocked<DriversService>;

  beforeEach(async () => {
    const serviceMock = {
      obtenerTodos: jest.fn(),
      obtenerUno: jest.fn(),
      crear: jest.fn(),
      actualizarDisponibilidad: jest.fn(),
      actualizarGanancias: jest.fn(),
      actualizarCalificacion: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [{ provide: DriversService, useValue: serviceMock }],
    }).compile();

    controller = module.get(DriversController);
    service = module.get(DriversService) as any;
  });

  it('debería retornar todos los drivers', async () => {
    const list = [{ id: 1 }] as any;
    service.obtenerTodos.mockResolvedValue(list);

    const result = await controller.obtenerTodos();
    expect(result).toEqual(list);
  });

  it('debería retornar un driver por id', async () => {
    const driver = { id: 1 } as any;
    service.obtenerUno.mockResolvedValue(driver);

    const result = await controller.obtenerUno(1);
    expect(result).toEqual(driver);
  });

  it('debería crear un driver', async () => {
    const dto = { nombre: 'Juan' };
    const driver = { id: 1 } as any;

    service.crear.mockResolvedValue(driver);

    const result = await controller.crear(dto);
    expect(result).toEqual(driver);
  });

  it('debería actualizar disponibilidad', async () => {
    const driver = { id: 1, disponible: true } as any;

    service.actualizarDisponibilidad.mockResolvedValue(driver);

    const result = await controller.actualizarDisponibilidad(1, true);
    expect(result).toEqual(driver);
  });

  it('debería actualizar ganancias', async () => {
    const driver = { id: 1, gananciasTotales: 200 } as any;

    service.actualizarGanancias.mockResolvedValue(driver);

    const result = await controller.actualizarGanancias(1, 200);
    expect(result).toEqual(driver);
  });

  it('debería actualizar calificación', async () => {
    const driver = { id: 1, calificacion: 5 } as any;

    service.actualizarCalificacion.mockResolvedValue(driver);

    const result = await controller.actualizarCalificacion(1, 5);
    expect(result).toEqual(driver);
  });
});
