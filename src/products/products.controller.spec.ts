import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { BadRequestException } from '@nestjs/common';

import * as yup from 'yup';
import { createProductSchema } from './dto/create-product.dto';
import { updateProductSchema } from './dto/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByRestaurant: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: mockProductsService }
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un producto con datos válidos', async () => {
      const dto = {
        nombre: 'Sushi',
        precio: 25,
        descripcion: 'Muy rico',
        stock: 10,
        imagen: 'foto.png',
        
      };

      jest.spyOn(service, 'create').mockResolvedValue({
        id: 1,
        ...dto
      } as any);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('debería lanzar BadRequestException si Yup no valida', async () => {
      jest.spyOn(createProductSchema, 'validate').mockRejectedValue(
        new yup.ValidationError('Datos inválidos')
      );

      const invalidData = {
        nombre: '',
        precio: 'no-numero' as any,
        descripcion: '',
        stock: -5 as any,
        imagen: 'foto.png'
      };

      await expect(controller.create(invalidData))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('debería actualizar un producto con datos válidos', async () => {
      const dto = {
        nombre: 'Nuevo nombre',
        precio: 30,
        descripcion: 'Texto válido',
        stock: 4,
        
      };

      jest.spyOn(service, 'update').mockResolvedValue({
        id: 1,
        ...dto
      } as any);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('debería lanzar BadRequestException si Yup falla', async () => {
      jest.spyOn(updateProductSchema, 'validate').mockRejectedValue(
        new yup.ValidationError('Error de yup')
      );

      const invalid = {
        nombre: '',
        precio: 'no-numero' as any,
        descripcion: '' as any,
        stock: 'abc' as any,
        
      };

      await expect(controller.update('1', invalid))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('debería devolver todos los productos', async () => {
      jest.spyOn(service, 'findAll').mockReturnValue(['a', 'b'] as any);

jest.spyOn(service, 'findOne').mockReturnValue({ id: 1 } as any);

jest.spyOn(service, 'remove').mockReturnValue('deleted' as any);


      const result = controller.findAll();
      expect(result).toEqual(['a', 'b']);
    });
  });

  describe('findOne', () => {
    it('debería devolver un producto por id', async () => {
      jest.spyOn(service, 'findOne').mockReturnValue({ id: 1 } as any);

      const result = controller.findOne('1');
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('remove', () => {
    it('debería eliminar un producto', async () => {
      jest.spyOn(service, 'remove').mockReturnValue('deleted' as any);

      const result = controller.remove('1');
      expect(result).toBe('deleted');
    });
  });
});