import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly usersService: UsersService,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurantData = {
      ...createRestaurantDto,
      horarioApertura: createRestaurantDto.horarioApertura || '08:00',
      horarioCierre: createRestaurantDto.horarioCierre || '22:00',
      activo: createRestaurantDto.activo !== false,
    };

    const restaurant = this.restaurantRepository.create(restaurantData);
    return this.restaurantRepository.save(restaurant);
  }

  async findAll(): Promise<Restaurant[]> {
    return await this.restaurantRepository.find();
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurante ${id} no encontrado`);
    }

    return restaurant;
  }

  async update(
    id: number,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    Object.assign(restaurant, updateRestaurantDto);
    return await this.restaurantRepository.save(restaurant);
  }

  async remove(id: number): Promise<void> {
    const result = await this.restaurantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Restaurante ${id} no encontrado`);
    }
  }

  async findByUser(userId: number): Promise<Restaurant[]> {
    return await this.restaurantRepository.find({
      where: { usuario: { id: userId } },
      relations: ['usuario', 'reviews'],
    });
  }
}
