import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RedisService } from '../infrastructure/redis/redis.service';
@ApiTags('health') @Controller('health') export class HealthController { constructor(private readonly redis: RedisService) {} @Get() async health() { return { ok: true, service: 'hitude-api', redis: await this.redis.health(), timestamp: new Date().toISOString() }; } }

