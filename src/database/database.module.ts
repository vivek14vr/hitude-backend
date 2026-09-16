import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { User, UserSchema } from './schemas/user.schema';
import { Order, OrderSchema } from './schemas/order.schema';
import { Consultation, ConsultationSchema } from './schemas/consultation.schema';
import { Review, ReviewSchema } from './schemas/review.schema';
import { BlogPost, BlogPostSchema } from './schemas/blog-post.schema';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
@Module({ imports: [MongooseModule.forRootAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: (config: ConfigService) => ({ uri: config.getOrThrow<string>('MONGODB_URI'), serverSelectionTimeoutMS: 5000 }) }), MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }, { name: User.name, schema: UserSchema }, { name: Order.name, schema: OrderSchema }, { name: Consultation.name, schema: ConsultationSchema }, { name: Review.name, schema: ReviewSchema }, { name: BlogPost.name, schema: BlogPostSchema }, { name: AuditLog.name, schema: AuditLogSchema }])], exports: [MongooseModule] })
export class DatabaseModule {}

