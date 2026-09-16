import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role, Roles } from '../common/decorators/roles.decorator';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { PrescriptionVerificationService } from './prescription-verification.service';
@ApiTags('prescription-verification') @Controller('prescription-verification') export class PrescriptionVerificationController { constructor(private readonly verification: PrescriptionVerificationService) {} @Post() @UseGuards(JwtAuthGuard) create(@Body() dto: CreateVerificationDto) { return this.verification.create(dto.orderId, dto.secureFileReference); } @Get(':orderId') @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT, Role.DOCTOR) @UseGuards(JwtAuthGuard, RolesGuard) status(@Param('orderId') orderId: string) { return this.verification.queueStatus(orderId); } }

