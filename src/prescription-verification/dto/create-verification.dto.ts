import { IsOptional, IsString, MinLength } from 'class-validator';
export class CreateVerificationDto { @IsString() @MinLength(1) orderId!: string; @IsOptional() @IsString() secureFileReference?: string; }

