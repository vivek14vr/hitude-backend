import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../database/schemas/product.schema';
import { Order, OrderSchema } from '../database/schemas/order.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
@Module({ imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }, { name: Product.name, schema: ProductSchema }])], controllers: [OrdersController], providers: [OrdersService], exports: [OrdersService] }) export class OrdersModule {}
