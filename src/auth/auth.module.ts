import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/schemas/user.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Global()
@Module({ imports: [JwtModule.register({}), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])], controllers: [AuthController], providers: [AuthService, JwtAuthGuard], exports: [AuthService, JwtModule, JwtAuthGuard] })
export class AuthModule {}
