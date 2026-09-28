import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, IsInt, IsMongoId, IsNumber, IsOptional, IsString, Min, MinLength, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @IsMongoId() productId!: string;
  @IsInt() @Min(1) quantity!: number;
  @IsInt() @Min(5) pack!: number;
}

export class ShippingAddressDto {
  @IsString() @MinLength(1) firstName!: string;
  @IsString() @MinLength(1) lastName!: string;
  @IsString() @MinLength(5) phone!: string;
  @IsString() @MinLength(5) address!: string;
  @IsString() @MinLength(1) city!: string;
  @IsString() @MinLength(1) state!: string;
  @IsString() @MinLength(6) pincode!: string;
}

export class CreateOrderDto {
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsNumber() @Min(0) subtotal!: number;
  @IsNumber() @Min(0) total!: number;

  @ValidateNested() @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto;

  @IsOptional() @IsString() @IsIn(['razorpay', 'cod']) paymentMethod?: string;
}
