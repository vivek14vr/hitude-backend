import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost, BlogPostDocument } from '../database/schemas/blog-post.schema';
@ApiTags('blog') @Controller('blog') export class BlogController { constructor(@InjectModel(BlogPost.name) private readonly posts: Model<BlogPostDocument>) {} @Get() all() { return this.posts.find({ published: true }).sort({ createdAt: -1 }); } @Get(':slug') one(@Param('slug') slug: string) { return this.posts.findOne({ slug, published: true }); } }

