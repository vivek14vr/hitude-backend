import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  canActivate(context: ExecutionContext) { const request = context.switchToHttp().getRequest(); const token = request.cookies?.hitude_access; if (!token) throw new UnauthorizedException('Authentication required'); try { request.user = this.jwt.verify(token, { secret: process.env.JWT_ACCESS_SECRET }); return true; } catch { throw new UnauthorizedException('Session expired'); } }
}

