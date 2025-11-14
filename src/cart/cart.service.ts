import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const cart = this.cartRepository.create(createCartDto);
    return this.cartRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({ relations: ['items'] });
  }

  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { idCart: id },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException(`Carrito ${id} no encontrado`);
    }

    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);

    if (updateCartDto.total !== undefined) cart.total = updateCartDto.total;
    if (updateCartDto.activo !== undefined) cart.activo = updateCartDto.activo;

    if (updateCartDto.items) {
      await this.cartItemRepository.delete({ carritoId: id });

      cart.items = updateCartDto.items.map((item) =>
        this.cartItemRepository.create({
          productoId: item.productId,
          cantidad: item.quantity,
          precioUnitario: item.price,
          carritoId: id,
        }),
      );
    }

    return this.cartRepository.save(cart);
  }

  async remove(id: number): Promise<void> {
    const cart = await this.findOne(id);
    await this.cartRepository.remove(cart);
  }
}
