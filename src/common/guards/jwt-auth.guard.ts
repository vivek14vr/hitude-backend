import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, @InjectModel(User.name) private readonly users: Model<UserDocument>) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.hitude_access;
    if (!token) throw new UnauthorizedException('Authentication required');

    try {
      const payload = this.jwt.verify<{ sub: string; ver?: number }> (token, { secret: process.env.JWT_ACCESS_SECRET });
      const user = await this.users.findById(payload.sub).select('email firstName role emailVerified deletionRequested authVersion').lean();
      if (!user || user.deletionRequested) throw new UnauthorizedException('Account is not available');
      if (!user.emailVerified) throw new UnauthorizedException('Email verification required');
      if ((payload.ver ?? 0) !== (user.authVersion ?? 0)) throw new UnauthorizedException('Session expired');
      request.user = { sub: user._id.toString(), email: user.email, firstName: user.firstName, role: user.role, emailVerified: user.emailVerified };
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Session expired');
    }
  }
}
