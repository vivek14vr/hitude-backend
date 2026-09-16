import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type BlogPostDocument = HydratedDocument<BlogPost>;
@Schema({ timestamps: true })
export class BlogPost { @Prop({ unique: true, index: true }) slug!: string; @Prop() title!: string; @Prop() excerpt!: string; @Prop() body!: string; @Prop() category!: string; @Prop({ default: false, index: true }) published!: boolean; @Prop() seoTitle?: string; @Prop() seoDescription?: string; }
export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);

