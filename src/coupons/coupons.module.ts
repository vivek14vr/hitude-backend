import { Body, Controller, Get, Module, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('coupons') @Controller('coupons') class CouponsController { @Get() list() { return { items: [], message: 'Coupons are managed in the admin CMS.' }; } @Post('validate') validate(@Body('code') code: string) { return { valid: false, code, message: 'Coupon validation is ready for an approved promotion rule.' }; } }
@Module({ controllers: [CouponsController] }) export class CouponsModule {}
