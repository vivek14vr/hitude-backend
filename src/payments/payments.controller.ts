import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
@ApiTags('payments') @Controller('payments') export class PaymentsController { constructor(private readonly payments: PaymentsService) {} @Post('checkout') checkout(@Body('amount') amount: number, @Body('orderId') orderId: string) { return this.payments.createCheckout(amount, orderId); } @Post('webhook') webhook(@Headers('x-razorpay-signature') signature: string, @Body() _payload: unknown) { this.payments.verifyWebhook(signature); return { received: true }; } }

