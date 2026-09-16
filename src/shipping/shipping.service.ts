import { Injectable } from '@nestjs/common';
import { RedisService } from '../infrastructure/redis/redis.service';
@Injectable() export class ShippingService { constructor(private readonly redis: RedisService) {} async check(pincode: string) { const cached = await this.redis.get<{ available: boolean; message: string }>(`shipping:${pincode}`); if (cached) return cached; const result = { available: /^\d{6}$/.test(pincode), message: /^\d{6}$/.test(pincode) ? 'Delivery availability confirmed for this pincode.' : 'Enter a valid 6-digit pincode.' }; await this.redis.set(`shipping:${pincode}`, result, 86400); return result; } }

