import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type ReviewDocument = HydratedDocument<Review>;
@Schema({ timestamps: true })
export class Review { @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', index: true }) productId!: string; @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' }) userId!: string; @Prop({ required: true, min: 1, max: 5 }) rating!: number; @Prop({ required: true, maxlength: 1000 }) body!: string; @Prop({ default: false, index: true }) approved!: boolean; @Prop({ default: false }) verifiedPurchase!: boolean; }
export const ReviewSchema = SchemaFactory.createForClass(Review);

