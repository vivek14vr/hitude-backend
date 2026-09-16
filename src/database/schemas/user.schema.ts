import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../common/decorators/roles.decorator';
export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, lowercase: true, trim: true }) email!: string;
  @Prop({ required: true }) passwordHash!: string;
  @Prop() firstName?: string;
  @Prop() phone?: string;
  @Prop({ enum: Object.values(Role), default: Role.CUSTOMER, index: true }) role!: Role;
  @Prop({ default: false }) emailVerified!: boolean;
  @Prop({ default: 0 }) failedLoginAttempts!: number;
  @Prop() lockedUntil?: Date;
  @Prop({ default: true }) marketingConsent!: boolean;
  @Prop({ default: false }) deletionRequested!: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
