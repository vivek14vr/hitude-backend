import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type ConsultationDocument = HydratedDocument<Consultation>;
@Schema({ timestamps: true })
export class Consultation {
  @Prop({ index: true }) userId?: string;
  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) email!: string;
  @Prop() phone?: string;
  @Prop({ required: true }) question!: string;
  @Prop({ enum: ['pending', 'assigned', 'completed', 'cancelled'], default: 'pending', index: true }) status!: string;
  @Prop() preferredTime?: string;
}
export const ConsultationSchema = SchemaFactory.createForClass(Consultation);
