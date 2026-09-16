import { Injectable } from '@nestjs/common';
import { RedisService } from '../infrastructure/redis/redis.service';
@Injectable() export class InventoryService { constructor(private readonly redis: RedisService) {} async reserve(key: string, seconds = 600) { const lock = await this.redis.get(`inventory-lock:${key}`); if (lock) return false; return this.redis.set(`inventory-lock:${key}`, { reserved: true }, seconds); } async release(key: string) { return this.redis.del(`inventory-lock:${key}`); } }

