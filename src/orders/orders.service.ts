import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../database/schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
@Injectable()
export class OrdersService { constructor(@InjectModel(Order.name) private readonly orders: Model<OrderDocument>) {} async create(dto: CreateOrderDto, userId?: string, idempotencyKey?: string) { if (idempotencyKey) { const existing = await this.orders.findOne({ idempotencyKey }); if (existing) return existing; } return this.orders.create({ ...dto, userId, idempotencyKey, orderNumber: `HT-${randomUUID().slice(0, 8).toUpperCase()}`, paymentStatus: dto.paymentMethod === 'cod' ? 'pending' : 'pending', status: 'pending' }); } async mine(userId: string) { return this.orders.find({ userId }).sort({ createdAt: -1 }); } async findAll() { return this.orders.find().sort({ createdAt: -1 }).limit(100); } }

