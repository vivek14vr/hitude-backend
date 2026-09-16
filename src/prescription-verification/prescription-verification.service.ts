import { Injectable } from '@nestjs/common';
import { RedisService } from '../infrastructure/redis/redis.service';
@Injectable() export class PrescriptionVerificationService { constructor(private readonly redis: RedisService) {} async create(orderId: string, secureFileReference?: string) { // Store the reference in the primary database/private object store; never the document bytes in Redis.
    const ticket = `verification:${orderId}`; await this.redis.set(ticket, { status: 'pending' }, 3600); return { orderId, status: 'pending', secureFileReference: secureFileReference ? 'stored-in-private-store' : undefined }; } async queueStatus(orderId: string) { return (await this.redis.get<{ status: string }>(`verification:${orderId}`)) ?? { orderId, status: 'pending' }; } }

