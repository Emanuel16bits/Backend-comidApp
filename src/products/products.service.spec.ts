import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: jest.Mocked<any>;

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
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get(getRepositoryToken(Product));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear y guardar un producto', async () => {
      const dto = {
        nombre: 'Sushi',
        precio: 25,
        descripcion: 'Muy rico',
        stock: 10,
        imagen: 'foto.png',
      };

      const product = { idProduct: 1, ...dto };

      repo.create.mockReturnValue(product);
      repo.save.mockResolvedValue(product);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(product);
      expect(result).toEqual(product);
    });
  });

  describe('findAll', () => {
    it('debería devolver todos los productos', async () => {
      const products = [{ idProduct: 1 }, { idProduct: 2 }];
      repo.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('debería devolver un producto por id', async () => {
      const product = { idProduct: 1 };
      repo.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { idProduct: 1 } });
      expect(result).toEqual(product);
    });

    it('debería lanzar NotFoundException si no lo encuentra', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar y guardar el producto', async () => {
      const existing = { idProduct: 1, nombre: 'Viejo' };
      const dto = { nombre: 'Nuevo' };

      repo.findOne.mockResolvedValue(existing);
      repo.save.mockResolvedValue({ ...existing, ...dto });

      const result = await service.update(1, dto);

      expect(result).toEqual({ idProduct: 1, nombre: 'Nuevo' });
    });
  });

  describe('remove', () => {
    it('debería eliminar un producto', async () => {
      const product = { idProduct: 1 };
      repo.findOne.mockResolvedValue(product);

      repo.remove.mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(repo.remove).toHaveBeenCalledWith(product);
      expect(result).toEqual({ message: 'Producto: 1 eliminado' });
    });
  });
});

