import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { BadRequestException } from '@nestjs/common';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: jest.Mocked<any>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [{ provide: ReviewsService, useValue: service }],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('debería crear una reseña válida', async () => {
    const dto = {
      calificacion: 5,
      comentario: 'Excelente',
    };

    service.create.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(dto);
    expect(result.id).toBe(1);
  });

  it('debería lanzar error si la reseña es inválida', async () => {
    const dto = { calificacion: 10, comentario: '' }; // inválido

    await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('debería retornar todas las reseñas', async () => {
    service.findAll.mockResolvedValue([]);

    const result = await controller.findAll();
    expect(result).toEqual([]);
  });

  it('debería retornar una reseña por id', async () => {
    service.findOne.mockResolvedValue({ id: 1 });

    const result = await controller.findOne('1');
    expect(result).toEqual({ id: 1 });
  });

  it('debería actualizar una reseña válida', async () => {
    const dto = { comentario: 'Nuevo comentario' };

    service.update.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.update('1', dto);
    expect(result.comentario).toBe('Nuevo comentario');
  });

  it('debería lanzar error si update recibe datos inválidos', async () => {
    const dto = { calificacion: 50 }; // inválido

    await expect(controller.update('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('debería eliminar una reseña', async () => {
    service.remove.mockResolvedValue(undefined);
    await expect(controller.remove('1')).resolves.not.toThrow();
  });
});
