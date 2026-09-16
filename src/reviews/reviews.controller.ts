import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
@ApiTags('reviews') @Controller('reviews') export class ReviewsController { @Get('product/:productId') list(@Param('productId') productId: string) { return { productId, items: [], message: 'Only approved, verified-purchase reviews are published.' }; } @Post() @UseGuards(JwtAuthGuard) create(@Body() body: { productId: string; rating: number; body: string }, @Req() req: Request & { user: { sub: string } }) { return { ...body, userId: req.user.sub, approved: false, verifiedPurchase: false }; } }

