import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
export class CreateConsultationDto { @IsString() @MinLength(1) name!: string; @IsEmail() email!: string; @IsOptional() @IsString() phone?: string; @IsString() @MinLength(10) question!: string; @IsOptional() @IsString() preferredTime?: string; }

