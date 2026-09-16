import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPost, BlogPostSchema } from '../database/schemas/blog-post.schema';
import { BlogController } from './blog.controller';
@Module({ imports: [MongooseModule.forFeature([{ name: BlogPost.name, schema: BlogPostSchema }])], controllers: [BlogController] }) export class BlogModule {}

