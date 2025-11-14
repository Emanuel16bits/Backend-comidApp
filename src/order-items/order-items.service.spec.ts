import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemsService } from './order-items.service';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { NotFoundException } from '@nestjs/common';

type MockRepo<T = any> = {
  create: jest.Mock;
  save: jest.Mock;
  remove: jest.Mock;
  createQueryBuilder: jest.Mock;
};

const createQueryBuilderMock = () => {
  const qb: any = {};

  qb.leftJoinAndSelect = jest.fn().mockReturnValue(qb);
  qb.select = jest.fn().mockReturnValue(qb);
  qb.where = jest.fn().mockReturnValue(qb);

  // ✅ getOne acepta null sin romper TS
  qb.getOne = jest.fn<Promise<OrderItem | null>, []>();

  // ✅ getMany devuelve array
  qb.getMany = jest.fn<Promise<OrderItem[]>, []>();

  return qb;
};

const createRepoMock = (): MockRepo => {
  const qb = createQueryBuilderMock();

  return {
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(qb),
  };
};

describe('OrderItemsService', () => {
  let service: OrderItemsService;
  let repo: MockRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemsService,
        {
          provide: getRepositoryToken(OrderItem),
          useValue: createRepoMock(),
        },
      ],
    }).compile();

    service = module.get<OrderItemsService>(OrderItemsService);
    repo = module.get(getRepositoryToken(OrderItem));
  });

  it('debería crear un OrderItem', async () => {
    const dto = { idOrden: 1, idProducto: 10, cantidad: 2 };
    const created = { id: 1, ...dto };

    repo.create.mockReturnValue(created);
    repo.save.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);
  });

  it('debería obtener todos', async () => {
    const items = [];
    repo.createQueryBuilder().getMany.mockResolvedValue(items);

    const result = await service.findAll();

    expect(result).toEqual(items);
  });

  it('debería obtener uno por id', async () => {
    const item = { id: 1 };
    repo.createQueryBuilder().getOne.mockResolvedValue(item as any);

    const result = await service.findOne(1);
    expect(result).toEqual(item);
  });

  it('debería tirar NotFoundException si no existe', async () => {
    repo.createQueryBuilder().getOne.mockResolvedValue(null);

    await expect(service.findOne(123)).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar un OrderItem', async () => {
    const existing = { id: 1, cantidad: 2 };
    const updated = { id: 1, cantidad: 5 };

    repo.createQueryBuilder().getOne.mockResolvedValue(existing as any);
    repo.save.mockResolvedValue(updated as any);

    const result = await service.update(1, { cantidad: 5 });

    expect(result).toEqual(updated);
  });

  it('debería eliminar un OrderItem', async () => {
    const item = { id: 1 };
    repo.createQueryBuilder().getOne.mockResolvedValue(item as any);
    repo.remove.mockResolvedValue(item as any);

    const result = await service.remove(1);

    expect(result).toEqual({ message: 'OrderItem con id 1 eliminado' });
  });
});

// Necesario para getRepositoryToken sin importarlo de Nest
function getRepositoryToken(entity: any) {
  return `${entity.name}Repository`;
}
