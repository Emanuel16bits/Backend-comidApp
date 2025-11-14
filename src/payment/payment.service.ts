import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Cart } from '../cart/entities/cart.entity';
import { User } from '../users/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { EstadoPago } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const cart = await this.cartRepository.findOne({
      where: { idCart: createPaymentDto.carritoId },
      relations: ['usuario'],
    });

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const user = await this.userRepository.findOne({
      where: { id: createPaymentDto.usuarioId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (cart.usuario.id !== createPaymentDto.usuarioId) {
      throw new BadRequestException(
        'El carrito no pertenece al usuario especificado',
      );
    }

    const payment = new Payment();
    payment.monto = Number(createPaymentDto.monto);
    payment.metodo = createPaymentDto.metodo;
    payment.estado = createPaymentDto.estado || EstadoPago.PENDIENTE;
    payment.idTransaccion = createPaymentDto.idTransaccion || null;
    payment.detalles = createPaymentDto.detalles || null;
    payment.carrito = cart;
    payment.usuario = user;

    try {
      return await this.paymentRepository.save(payment);
    } catch {
      throw new BadRequestException('Error');
    }
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['carrito', 'usuario'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['carrito', 'usuario'],
    });

    if (!payment) {
      throw new NotFoundException(`Pago con id ${id} no encontrado`);
    }

    return payment;
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Pago con id ${id} no encontrado`);
    }

    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async updatePatch(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Pago con id ${id} no encontrado`);
    }

    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.paymentRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Pago con id ${id} no encontrado`);
    }
  }

  async findByUser(usuarioId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['carrito'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findByCart(carritoId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { carrito: { idCart: carritoId } },
      relations: ['usuario'],
      order: { fechaCreacion: 'DESC' },
    });
  }
}
