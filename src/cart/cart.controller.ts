import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
@ApiTags('cart') @Controller('cart') export class CartController { @Get() get(@Req() request: Request) { return { session: request.headers['x-cart-session'] ?? 'guest', items: [] }; } @Post('sync') @UseGuards(JwtAuthGuard) sync(@Body() body: unknown) { return { ok: true, body }; } }

