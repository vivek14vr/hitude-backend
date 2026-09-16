import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role, Roles } from '../common/decorators/roles.decorator';
@ApiTags('products') @Controller('products')
export class ProductsController { constructor(private readonly products: ProductsService) {} @Get() @ApiOperation({ summary: 'List published products' }) all() { return this.products.findAll(); } @Get(':slug') one(@Param('slug') slug: string) { return this.products.findBySlug(slug); } @Post() @Roles(Role.ADMIN, Role.SUPER_ADMIN) @UseGuards(JwtAuthGuard, RolesGuard) create(@Body() dto: CreateProductDto) { return this.products.create(dto); } @Patch(':id') @Roles(Role.ADMIN, Role.SUPER_ADMIN) @UseGuards(JwtAuthGuard, RolesGuard) update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) { return this.products.update(id, dto); } @Delete(':id') @Roles(Role.ADMIN, Role.SUPER_ADMIN) @UseGuards(JwtAuthGuard, RolesGuard) remove(@Param('id') id: string) { return this.products.remove(id); } }

