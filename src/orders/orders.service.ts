import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../database/schemas/product.schema';
import { Order, OrderDocument } from '../database/schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private readonly orders: Model<OrderDocument>, @InjectModel(Product.name) private readonly products: Model<ProductDocument>) {}

  async create(dto: CreateOrderDto, userId: string, idempotencyKey?: string) {
    if (idempotencyKey) {
      const existing = await this.orders.findOne({ idempotencyKey, userId });
      if (existing) return existing;
    }

    const productIds = [...new Set(dto.items.map((item) => item.productId))];
    let products: Array<{ _id: unknown; name: string; packs: Array<{ quantity: number; price: number }>; status: string }>;
    try {
      products = await this.products.find({ _id: { $in: productIds }, publishReady: true }).select('name packs status').lean();
    } catch {
      throw new BadRequestException('One or more products are invalid');
    }

    const productMap = new Map(products.map((product) => [String(product._id), product]));
    const items = dto.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new BadRequestException('One or more products are unavailable');
      if (product.status === 'out_of_stock') throw new BadRequestException(`${product.name} is out of stock`);
      const pack = product.packs.find((option) => option.quantity === item.pack);
      if (!pack) throw new BadRequestException(`The selected pack for ${product.name} is unavailable`);
      return { productId: String(product._id), name: product.name, quantity: item.quantity, pack: item.pack, unitPrice: pack.price };
    });

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shipping = subtotal >= 999 ? 0 : 79;
    const total = subtotal + shipping;
    return this.orders.create({ items, subtotal, total, shippingAddress: dto.shippingAddress, userId, idempotencyKey, orderNumber: `HT-${randomUUID().slice(0, 8).toUpperCase()}`, paymentStatus: 'pending', status: 'pending' });
  }

  async mine(userId: string) { return this.orders.find({ userId }).sort({ createdAt: -1 }); }
  async findAll() { return this.orders.find().sort({ createdAt: -1 }).limit(100); }
}
