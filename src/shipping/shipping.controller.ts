import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
@ApiTags('shipping') @Controller('shipping') export class ShippingController { constructor(private readonly shipping: ShippingService) {} @Get('pincode/:pincode') check(@Param('pincode') pincode: string) { return this.shipping.check(pincode); } }

