import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

describe('OrdersService', () => {
  let service: OrdersService;
  let repo: jest.Mocked<Repository<Order>>;

  beforeEach(async () => {
    const repoMock = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repo = module.get(getRepositoryToken(Order));
  });

  it('debería crear una orden', async () => {
    const dto = { precioTotal: 100, idUsuario: 1, estado: 'PENDIENTE' };
    const created = { id: 1, ...dto };

    repo.create.mockReturnValue(created as any);
    repo.save.mockResolvedValue(created as any);

    const result = await service.create(dto as any);

    expect(result).toEqual(created);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
  });
});
