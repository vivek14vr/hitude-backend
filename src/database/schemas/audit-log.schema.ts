import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type AuditLogDocument = HydratedDocument<AuditLog>;
@Schema({ timestamps: true })
export class AuditLog { @Prop({ index: true }) actorId!: string; @Prop({ required: true }) action!: string; @Prop({ required: true }) resource!: string; @Prop({ type: Object }) metadata?: Record<string, unknown>; @Prop() ip?: string; }
export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

