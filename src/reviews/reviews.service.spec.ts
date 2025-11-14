import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewRepo: jest.Mocked<any>;

  beforeEach(async () => {
    reviewRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: getRepositoryToken(Review), useValue: reviewRepo },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('debería crear una reseña', async () => {
    const dto = {
      calificacion: 5,
      comentario: 'Genial',
    };

    const saved = { id: 1, ...dto };

    reviewRepo.create.mockReturnValue(saved);
    reviewRepo.save.mockResolvedValue(saved);

    const result = await service.create(dto);
    expect(result).toEqual(saved);
  });

  it('debería retornar todas las reseñas', async () => {
    reviewRepo.find.mockResolvedValue([]);

    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('debería retornar una reseña por id', async () => {
    const review = { id: 1, comentario: 'Bien' };

    reviewRepo.findOne.mockResolvedValue(review);

    const result = await service.findOne(1);
    expect(result).toEqual(review);
  });

  it('debería lanzar error si no existe', async () => {
    reviewRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar una reseña', async () => {
    const review = { id: 1, comentario: 'Antes' };
    const updated = { id: 1, comentario: 'Después' };

    reviewRepo.findOne.mockResolvedValue(review);
    reviewRepo.save.mockResolvedValue(updated);

    const result = await service.update(1, { comentario: 'Después' });

    expect(result).toEqual(updated);
  });

  it('debería eliminar una reseña', async () => {
    const review = { id: 1 };

    reviewRepo.findOne.mockResolvedValue(review);
    reviewRepo.remove.mockResolvedValue(undefined);

    await expect(service.remove(1)).resolves.toBeUndefined();
  });
});

