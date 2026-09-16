import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client = new Redis(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379', { lazyConnect: true, maxRetriesPerRequest: 1, enableOfflineQueue: false, retryStrategy: () => null });
  private connected = false;
  async onModuleInit() { try { await this.client.connect(); this.connected = true; } catch (error) { this.logger.warn(`Redis unavailable; continuing without cache. ${error instanceof Error ? error.message : ''}`); } }
  async get<T>(key: string): Promise<T | null> { if (!this.connected) return null; try { const value = await this.client.get(key); return value ? JSON.parse(value) as T : null; } catch { return null; } }
  async set(key: string, value: unknown, ttlSeconds = 300) { if (!this.connected) return false; try { await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds); return true; } catch { return false; } }
  async del(key: string) { if (!this.connected) return false; try { await this.client.del(key); return true; } catch { return false; } }
  async health() { if (!this.connected) return { ok: false, fallback: true }; try { return { ok: (await this.client.ping()) === 'PONG', fallback: false }; } catch { return { ok: false, fallback: true }; } }
  async onModuleDestroy() { await this.client.quit().catch(() => undefined); }
}
