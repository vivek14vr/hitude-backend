import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role, Roles } from '../common/decorators/roles.decorator';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { ConsultationsService } from './consultations.service';
@ApiTags('consultations') @Controller('consultations') export class ConsultationsController { constructor(private readonly consultations: ConsultationsService) {} @Post() create(@Body() dto: CreateConsultationDto, @Req() req: Request & { user?: { sub: string } }) { return this.consultations.create(dto, req.user?.sub); } @Get() @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT, Role.DOCTOR) @UseGuards(JwtAuthGuard, RolesGuard) all() { return this.consultations.all(); } }

