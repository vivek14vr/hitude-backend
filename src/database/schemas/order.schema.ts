import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type OrderDocument = HydratedDocument<Order>;
@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true, index: true }) orderNumber!: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', index: true }) userId?: string;
  @Prop({ type: [{ productId: String, name: String, quantity: Number, pack: Number, unitPrice: Number }] }) items!: Array<Record<string, unknown>>;
  @Prop({ required: true }) subtotal!: number;
  @Prop({ required: true }) total!: number;
  @Prop({ enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending', index: true }) paymentStatus!: string;
  @Prop({ enum: ['pending', 'verification_pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending', index: true }) status!: string;
  @Prop({ type: Object }) shippingAddress!: Record<string, string>;
  @Prop() idempotencyKey?: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ createdAt: -1 });

