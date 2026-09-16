import { Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable() export class PaymentsService { createCheckout(amount: number, orderId: string) { return { provider: 'razorpay', orderId, amount, configured: Boolean(process.env.RAZORPAY_KEY_ID) }; } verifyWebhook(signature: string | undefined) { if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) throw new UnauthorizedException('Webhook verification is not configured'); return true; } }

