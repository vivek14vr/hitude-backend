import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type ProductDocument = HydratedDocument<Product>;
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true, index: true }) slug!: string;
  @Prop({ required: true }) name!: string;
  @Prop({ required: true, enum: ['strawberry', 'citrus'] }) profile!: string;
  @Prop({ required: true }) description!: string;
  @Prop({ required: true }) price!: number;
  @Prop() compareAt?: number;
  @Prop({ type: [{ quantity: Number, price: Number, label: String }] }) packs!: Array<{ quantity: number; price: number; label: string }>;
  @Prop({ type: [String] }) ingredients!: string[];
  @Prop({ type: [String] }) notes!: string[];
  @Prop({ enum: ['in_stock', 'low_stock', 'out_of_stock'], default: 'in_stock', index: true }) status!: string;
  @Prop({ default: true }) verificationRequired!: boolean;
  @Prop({ default: false }) publishReady!: boolean;
}
export const ProductSchema = SchemaFactory.createForClass(Product);

