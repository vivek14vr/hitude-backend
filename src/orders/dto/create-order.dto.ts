import { IsArray, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';
export class CreateOrderDto { @IsArray() items!: Array<{ productId: string; quantity: number; pack: number; unitPrice: number; name: string }>; @IsNumber() @Min(0) subtotal!: number; @IsNumber() @Min(0) total!: number; @IsObject() shippingAddress!: Record<string, string>; @IsOptional() @IsString() paymentMethod?: string; }

