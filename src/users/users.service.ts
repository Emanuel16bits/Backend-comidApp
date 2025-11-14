import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Driver } from '../drivers/entities/driver.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userData: DeepPartial<User> = {
      nombre: createUserDto.nombre,
      email: createUserDto.email,
      password: hashedPassword,
      rol: createUserDto.rol as UserRole,
    };

    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);

    if (savedUser.rol === UserRole.REPARTIDOR) {
      await this.createDriverForUser(savedUser);
    }

    return savedUser;
  }

  private async createDriverForUser(user: User): Promise<void> {
    const driverData = {
      userId: user.id,
      nombre: user.nombre,
      email: user.email,
      disponible: true,
      calificacion: 0,
      gananciasTotales: 0,
      tipoVehiculo: null,
      placa: null,
      marca: null,
      modelo: null,
      color: null,
      anio: null,
    };

    const driver = this.driverRepository.create(driverData);
    await this.driverRepository.save(driver);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario ${id} no encontrado`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: `Usuario ${id} eliminado` };
  }

  async findDriverByUserId(userId: number): Promise<Driver | null> {
    return await this.driverRepository.findOne({ where: { userId } });
  }
}
