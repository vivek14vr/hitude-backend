import { Injectable, Module, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
class NotificationQueue implements OnModuleDestroy {
  readonly queue = new Queue('hitude-notifications', { connection: { url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379', maxRetriesPerRequest: 1, enableOfflineQueue: false, retryStrategy: () => null } });

  constructor() {
    this.queue.on('error', () => undefined);
  }

  async onModuleDestroy() {
    try {
      await this.queue.disconnect();
    } catch {
      // Redis is optional for CLI seed commands and local development.
    }
  }
}

@Module({
  providers: [
    NotificationQueue,
    {
      provide: 'HITUDE_NOTIFICATION_QUEUE',
      inject: [NotificationQueue],
      useFactory: (queue: NotificationQueue) => queue.queue,
    },
  ],
  exports: ['HITUDE_NOTIFICATION_QUEUE'],
})
export class QueuesModule {}
