import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/entities/user.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const user = await this.usersRepository.findOne({
      where: { id: createProductDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario con ID ${createProductDto.userId} no encontrado`,
      );
    }

    const restaurant = await this.restaurantsRepository.findOne({
      where: {
        id: createProductDto.restaurantId,
        usuario: { id: createProductDto.userId },
      },
    });

    if (!restaurant) {
      throw new BadRequestException(
        'Restaurante no encontrado o no tienes permisos',
      );
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      usuario: user,
      restaurante: restaurant,
    });

    return await this.productsRepository.save(product);
  }

  async findAll() {
    return await this.productsRepository.find({
      relations: ['restaurante'],
    });
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { idProduct: id },
      relations: ['restaurante', 'usuario'],
    });

    if (!product) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return product;
  }

  async update(id: number, updateProductDto: Partial<UpdateProductDto>) {
    const product = await this.productsRepository.findOne({
      where: { idProduct: id },
      relations: ['usuario', 'restaurante'],
    });

    if (!product) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }

    Object.assign(product, updateProductDto);

    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return this.productsRepository.remove(product);
  }

  async findByUser(userId: number) {
    return await this.productsRepository.find({
      where: { usuario: { id: userId } },
      relations: ['restaurante'],
    });
  }

  async findByRestaurant(restaurantId: number) {
    return await this.productsRepository.find({
      where: { restaurante: { id: restaurantId } },
      relations: ['restaurante'],
    });
  }
}
