import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ProductsModule } from './products/products.module';
import { CollectionsModule } from './collections/collections.module';
import { InventoryModule } from './inventory/inventory.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { CouponsModule } from './coupons/coupons.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { PrescriptionVerificationModule } from './prescription-verification/prescription-verification.module';
import { ShippingModule } from './shipping/shipping.module';
import { BlogModule } from './blog/blog.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { QueuesModule } from './queues/queues.module';
import { HealthController } from './common/health.controller';
@Module({ imports: [ConfigModule.forRoot({ isGlobal: true }), ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]), RedisModule, DatabaseModule, QueuesModule, AuthModule, UsersModule, RolesModule, ProductsModule, CollectionsModule, InventoryModule, CartModule, OrdersModule, PaymentsModule, CouponsModule, ReviewsModule, ConsultationsModule, PrescriptionVerificationModule, ShippingModule, BlogModule, NotificationsModule, AdminModule], controllers: [HealthController], providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }] })
export class AppModule {}

