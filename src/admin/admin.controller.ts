import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Role, Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { User, UserDocument } from '../database/schemas/user.schema';
import { Order, OrderDocument } from '../database/schemas/order.schema';
import { Product, ProductDocument } from '../database/schemas/product.schema';
@ApiTags('admin') @Controller('admin') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT)
export class AdminController { constructor(@InjectModel(User.name) private readonly users: Model<UserDocument>, @InjectModel(Order.name) private readonly orders: Model<OrderDocument>, @InjectModel(Product.name) private readonly products: Model<ProductDocument>) {} @Get('dashboard') async dashboard() { const [customers, orders, products, revenue] = await Promise.all([this.users.countDocuments({ role: Role.CUSTOMER }), this.orders.countDocuments(), this.products.countDocuments(), this.orders.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }])]); return { customers, orders, products, revenue: revenue[0]?.total ?? 0, generatedAt: new Date().toISOString() }; } }

