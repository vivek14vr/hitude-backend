import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/schemas/user.schema';
import { Order, OrderSchema } from '../database/schemas/order.schema';
import { Product, ProductSchema } from '../database/schemas/product.schema';
import { AdminController } from './admin.controller';
@Module({ imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Order.name, schema: OrderSchema }, { name: Product.name, schema: ProductSchema }])], controllers: [AdminController] }) export class AdminModule {}

