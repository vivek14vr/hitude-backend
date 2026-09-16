import { Body, Controller, Get, Headers, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Role, Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
@ApiTags('orders') @Controller('orders') export class OrdersController { constructor(private readonly orders: OrdersService) {} @Post() create(@Body() dto: CreateOrderDto, @Req() req: Request & { user?: { sub: string } }, @Headers('idempotency-key') key?: string) { return this.orders.create(dto, req.user?.sub, key); } @Get('mine') @UseGuards(JwtAuthGuard) mine(@Req() req: Request & { user: { sub: string } }) { return this.orders.mine(req.user.sub); } @Get() @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT) @UseGuards(JwtAuthGuard, RolesGuard) all() { return this.orders.findAll(); } }

