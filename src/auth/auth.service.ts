import { ConflictException, Injectable, Logger, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { RedisService } from '../infrastructure/redis/redis.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(@InjectModel(User.name) private readonly users: Model<UserDocument>, private readonly jwt: JwtService, private readonly redis: RedisService) {}

  async register(dto: RegisterDto) {
    if (!dto.consent) throw new UnauthorizedException('Privacy policy and terms consent is required');
    if (process.env.NODE_ENV === 'production' && !process.env.RESEND_API_KEY) throw new ServiceUnavailableException('Email verification is not configured');

    const email = dto.email.toLowerCase();
    if (await this.users.exists({ email })) throw new ConflictException('An account with this email already exists');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.users.create({ email, passwordHash, firstName: dto.firstName, marketingConsent: dto.consent });
    const verificationToken = this.jwt.sign({ sub: user._id.toString(), purpose: 'email-verification' }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '30m' });
    const verificationUrl = this.verificationUrl(verificationToken);

    try {
      const stored = await this.redis.set(`email-verification:${user._id}`, verificationToken, 1800);
      if (!stored) throw new ServiceUnavailableException('Verification email could not be sent');
      await this.sendVerificationEmail(email, verificationUrl);
    } catch (error) {
      await this.redis.del(`email-verification:${user._id}`);
      await this.users.findByIdAndDelete(user._id);
      throw error instanceof ServiceUnavailableException ? error : new ServiceUnavailableException('Verification email could not be sent');
    }

    return {
      user: this.publicUser(user),
      ...(process.env.NODE_ENV === 'production' ? {} : { verificationUrl }),
    };
  }

  async login(email: string, password: string) {
    const user = await this.users.findOne({ email: email.toLowerCase() });
    if (!user) throw new UnauthorizedException('Email or password is incorrect');
    if (user.lockedUntil && user.lockedUntil > new Date()) throw new UnauthorizedException('Account temporarily locked. Try again later.');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.failedLoginAttempts = 0;
      }
      await user.save();
      throw new UnauthorizedException('Email or password is incorrect');
    }
    if (!user.emailVerified) throw new UnauthorizedException('Please verify your email before signing in.');
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    await user.save();
    return { user: this.publicUser(user), tokens: this.tokens(user) };
  }

  async refresh(refreshToken?: string) {
    try {
      if (!refreshToken) throw new Error('missing token');
      const payload = this.jwt.verify<{ sub: string; role: string; ver?: number }>(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.users.findById(payload.sub);
      if (!user || !user.emailVerified || user.deletionRequested || (payload.ver ?? 0) !== (user.authVersion ?? 0)) throw new Error('missing, stale, or unavailable user');
      return this.tokens(user);
    } catch {
      throw new UnauthorizedException('Refresh session expired');
    }
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwt.verify<{ sub: string; purpose: string }>(token, { secret: process.env.JWT_ACCESS_SECRET });
      if (payload.purpose !== 'email-verification') throw new Error('invalid purpose');
      const stored = await this.redis.get<string>(`email-verification:${payload.sub}`);
      if (!stored || stored !== token) throw new Error('token mismatch');
      const user = await this.users.findByIdAndUpdate(payload.sub, { emailVerified: true });
      if (!user) throw new Error('missing user');
      await this.redis.del(`email-verification:${payload.sub}`);
      return { ok: true };
    } catch {
      throw new UnauthorizedException('Email verification link is invalid or expired');
    }
  }

  async requestPasswordReset(email: string) {
    const message = 'If the account exists, a reset link has been sent.';
    const user = await this.users.findOne({ email: email.toLowerCase() });
    if (!user) return { ok: true, message };
    if (process.env.NODE_ENV === 'production' && !process.env.RESEND_API_KEY) {
      this.logger.error('Password reset requested but email delivery is not configured');
      return { ok: true, message };
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashResetToken(token);
    const resetUrl = this.passwordResetUrl(token);
    const stored = await this.redis.set(`password-reset:${tokenHash}`, user._id.toString(), 1800);

    if (!stored) {
      this.logger.error('Password reset requested while Redis is unavailable');
      return { ok: true, message };
    }

    try {
      await this.sendPasswordResetEmail(user.email, resetUrl);
    } catch (error) {
      await this.redis.del(`password-reset:${tokenHash}`);
      this.logger.error(`Password reset email could not be sent: ${error instanceof Error ? error.message : 'unknown error'}`);
      return { ok: true, message };
    }

    return {
      ok: true,
      message,
      ...(process.env.NODE_ENV === 'production' ? {} : { resetUrl }),
    };
  }

  async resetPassword(token: string, password: string) {
    const tokenHash = this.hashResetToken(token);
    const userId = await this.redis.take<string>(`password-reset:${tokenHash}`);
    if (!userId) throw new UnauthorizedException('Password reset link is invalid or expired');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.users.findByIdAndUpdate(userId, { $set: { passwordHash, failedLoginAttempts: 0, lockedUntil: undefined }, $inc: { authVersion: 1 } });
    if (!user) throw new UnauthorizedException('Password reset link is invalid or expired');

    return { ok: true };
  }

  private verificationUrl(token: string) {
    const baseUrl = (process.env.PUBLIC_APP_URL ?? process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000').split(',')[0].replace(/\/$/, '');
    return `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  }

  private passwordResetUrl(token: string) {
    const baseUrl = (process.env.PUBLIC_APP_URL ?? process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000').split(',')[0].replace(/\/$/, '');
    return `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  }

  private hashResetToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private async sendVerificationEmail(email: string, verificationUrl: string) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.info(`[HITUDE] Email verification link for ${email}: ${verificationUrl}`);
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? 'HITUDE <onboarding@resend.dev>',
        to: [email],
        subject: 'Verify your HITUDE account',
        html: `<p>Welcome to HITUDE.</p><p>Verify your account by opening this link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p><p>This link expires in 30 minutes.</p>`,
      }),
    });
    if (!response.ok) throw new ServiceUnavailableException('Verification email could not be sent');
  }

  private async sendPasswordResetEmail(email: string, resetUrl: string) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      if (process.env.NODE_ENV === 'production') throw new ServiceUnavailableException('Password reset email could not be sent');
      console.info(`[HITUDE] Password reset link for ${email}: ${resetUrl}`);
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? 'HITUDE <onboarding@resend.dev>',
        to: [email],
        subject: 'Reset your HITUDE password',
        html: `<p>We received a request to reset your HITUDE password.</p><p><a href="${resetUrl}">Choose a new password</a></p><p>This link expires in 30 minutes and can be used once.</p>`,
      }),
    });
    if (!response.ok) throw new ServiceUnavailableException('Password reset email could not be sent');
  }

  private tokens(user: UserDocument) {
    return {
      accessToken: this.jwt.sign({ sub: user._id.toString(), role: user.role, ver: user.authVersion ?? 0 }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' }),
      refreshToken: this.jwt.sign({ sub: user._id.toString(), role: user.role, ver: user.authVersion ?? 0 }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' }),
    };
  }

  private publicUser(user: UserDocument) {
    return { id: user._id.toString(), email: user.email, firstName: user.firstName, role: user.role, emailVerified: user.emailVerified };
  }
}
