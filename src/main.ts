import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { SanitizePipe } from './common/pipes/sanitize.pipe';
import { SecureExceptionFilter } from './common/http-exception.filter';
async function bootstrap() { const app = await NestFactory.create(AppModule, { cors: false }); app.setGlobalPrefix('api'); app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); app.use(cookieParser()); const uploadsDirectory = join(process.cwd(), 'uploads'); if (!existsSync(uploadsDirectory)) mkdirSync(uploadsDirectory, { recursive: true }); app.use('/uploads', express.static(uploadsDirectory, { maxAge: '30d', immutable: true })); app.enableCors({ origin: (process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000').split(',').map((origin) => origin.trim()), credentials: true }); app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }), new SanitizePipe()); app.useGlobalFilters(new SecureExceptionFilter()); const swaggerConfig = new DocumentBuilder().setTitle('HITUDE API').setDescription('Secure commerce, account, content, and operations API for HITUDE.').setVersion('1.0').addCookieAuth('hitude_access').build(); SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig)); await app.listen(Number(process.env.PORT ?? 4000)); }
bootstrap();
