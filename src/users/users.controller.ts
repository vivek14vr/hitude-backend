import { Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
@ApiTags('users') @Controller('users') @UseGuards(JwtAuthGuard)
export class UsersController { constructor(private readonly users: UsersService) {} @Get('me') me(@Req() request: Request & { user: { sub: string } }) { return this.users.me(request.user.sub); } @Delete('me') delete(@Req() request: Request & { user: { sub: string } }) { return this.users.requestDeletion(request.user.sub); } }

