import { Injectable, Logger } from '@nestjs/common';
@Injectable() export class NotificationsService { private readonly logger = new Logger(NotificationsService.name); async enqueue(event: string, payload: Record<string, unknown>) { this.logger.log(`notification queued: ${event}`); return { queued: true, event, payloadKeys: Object.keys(payload) }; } }

