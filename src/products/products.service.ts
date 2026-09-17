import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '../infrastructure/redis/redis.service';
import { Product, ProductDocument } from '../database/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly products: Model<ProductDocument>, private readonly redis: RedisService) {}
  async findAll() { const cached = await this.redis.get<Product[]>('products:published'); if (cached) return cached; const products = await this.products.find({ publishReady: true }).sort({ createdAt: -1 }).lean(); await this.redis.set('products:published', products, 300); return products; }
  async findAllForAdmin() { return this.products.find().sort({ createdAt: -1 }).lean(); }
  async findBySlug(slug: string) { const cached = await this.redis.get<Product>(`product:${slug}`); if (cached) return cached; const product = await this.products.findOne({ slug, publishReady: true }).lean(); if (!product) throw new NotFoundException('Product not found'); await this.redis.set(`product:${slug}`, product, 300); return product; }
  async create(dto: CreateProductDto) { const result = await this.products.create(dto); await this.redis.del('products:published'); return result; }
  async update(id: string, dto: Partial<CreateProductDto>) { const result = await this.products.findByIdAndUpdate(id, dto, { new: true }); if (!result) throw new NotFoundException('Product not found'); await this.redis.del('products:published'); await this.redis.del(`product:${result.slug}`); return result; }
  async remove(id: string) { const result = await this.products.findByIdAndDelete(id); if (!result) throw new NotFoundException('Product not found'); await this.redis.del('products:published'); await this.redis.del(`product:${result.slug}`); return { ok: true }; }
}
