import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,

    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(data: CreateCartItemDto): Promise<CartItem> {
    const carrito = await this.cartRepo.findOne({
      where: { idCart: data.idCart },
    });
    if (!carrito) {
      throw new NotFoundException('El carrito no existe');
    }

    const producto = await this.productRepo.findOne({
      where: { idProduct: data.idProducto },
    });
    if (!producto) {
      throw new NotFoundException('El producto no existe');
    }

    const existente = await this.cartItemRepo.findOne({
      where: {
        carritoId: data.idCart,
        productoId: data.idProducto,
      },
    });

    if (existente) {
      existente.cantidad += data.cantidad;
      existente.precioUnitario = data.precioUnitario;
      const actualizado = await this.cartItemRepo.save(existente);
      await this.actualizarTotalCarrito(data.idCart);
      return actualizado;
    }

    const nuevoItem = this.cartItemRepo.create({
      carrito,
      producto,
      carritoId: data.idCart,
      productoId: data.idProducto,
      cantidad: data.cantidad,
      precioUnitario: data.precioUnitario,
    });

    const guardado = await this.cartItemRepo.save(nuevoItem);
    await this.actualizarTotalCarrito(data.idCart);

    return guardado;
  }

  async findAll(): Promise<CartItem[]> {
    return this.cartItemRepo.find({
      relations: ['carrito', 'producto'],
    });
  }

  async findOne(id: number): Promise<CartItem> {
    const item = await this.cartItemRepo.findOne({
      where: { id },
      relations: ['carrito', 'producto'],
    });

    if (!item) {
      throw new NotFoundException(`item con id ${id} no encontrado`);
    }

    return item;
  }

  async update(id: number, data: UpdateCartItemDto): Promise<CartItem> {
    const item = await this.findOne(id);

    if (data.cantidad !== undefined && data.cantidad !== null) {
      if (data.cantidad <= 0) {
        throw new BadRequestException('La cantidad tiene que ser mayor a 0');
      }
    }

    let carrito = item.carrito;
    let producto = item.producto;

    if (data.idCart && data.idCart !== item.carritoId) {
      const nuevoCarrito = await this.cartRepo.findOne({
        where: { idCart: data.idCart },
      });
      if (!nuevoCarrito) {
        throw new NotFoundException('El carrito no existe');
      }
      carrito = nuevoCarrito;
    }

    if (data.idProducto && data.idProducto !== item.productoId) {
      const nuevoProducto = await this.productRepo.findOne({
        where: { idProduct: data.idProducto },
      });
      if (!nuevoProducto) {
        throw new NotFoundException('El producto no existe');
      }
      producto = nuevoProducto;
    }

    item.carrito = carrito;
    item.producto = producto;
    item.carritoId = data.idCart ?? item.carritoId;
    item.productoId = data.idProducto ?? item.productoId;
    item.cantidad = data.cantidad ?? item.cantidad;
    item.precioUnitario = data.precioUnitario ?? item.precioUnitario;

    const actualizado = await this.cartItemRepo.save(item);
    await this.actualizarTotalCarrito(item.carritoId);

    return actualizado;
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    const idCarrito = item.carritoId;

    await this.cartItemRepo.remove(item);
    await this.actualizarTotalCarrito(idCarrito);
  }

  private async actualizarTotalCarrito(idCarrito: number): Promise<void> {
    const items = await this.cartItemRepo.find({
      where: { carritoId: idCarrito },
    });

    const total = items.reduce(
      (suma, item) => suma + item.cantidad * Number(item.precioUnitario),
      0,
    );

    await this.cartRepo.update(idCarrito, { total });
  }
}
