import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('register') @ApiOperation({ summary: 'Register a customer account' }) async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) { const result = await this.auth.register(dto); this.setCookies(response, result.tokens); return { user: result.user }; }
  @Post('login') @ApiOperation({ summary: 'Login with email and password' }) async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) { const result = await this.auth.login(dto.email, dto.password); this.setCookies(response, result.tokens); return { user: result.user }; }
  @Post('logout') logout(@Res({ passthrough: true }) response: Response) { response.clearCookie('hitude_access', this.cookieOptions()); response.clearCookie('hitude_refresh', this.cookieOptions()); return { ok: true }; }
  @Post('forgot-password') forgotPassword(@Body('email') _email: string) { return { ok: true, message: 'If the account exists, a reset link has been sent.' }; }
  @Post('refresh') async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) { const tokens = await this.auth.refresh(request.cookies?.hitude_refresh); this.setCookies(response, tokens); return { ok: true }; }
  @Post('verify-email') verifyEmail(@Body('token') token: string) { return this.auth.verifyEmail(token); }
  @Post('otp/request') otpRequest(@Body('phone') phone: string) { return { ok: true, phoneMasked: phone ? `${phone.slice(0, 3)}••••${phone.slice(-2)}` : undefined, message: 'OTP delivery is queued when an approved SMS provider is configured.' }; }
  @Post('otp/verify') otpVerify(@Body('phone') _phone: string, @Body('otp') _otp: string) { return { ok: false, message: 'OTP verification requires a configured SMS provider.' }; }
  @Get('google') google() { return { configured: Boolean(process.env.GOOGLE_CLIENT_ID), message: 'Complete OAuth callback wiring before enabling Google login.' }; }
  private setCookies(response: Response, tokens: { accessToken: string; refreshToken: string }) { response.cookie('hitude_access', tokens.accessToken, { ...this.cookieOptions(), maxAge: 15 * 60 * 1000 }); response.cookie('hitude_refresh', tokens.refreshToken, { ...this.cookieOptions(), maxAge: 30 * 24 * 60 * 60 * 1000, path: '/api/auth' }); }
  private cookieOptions() { return { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true', sameSite: 'lax' as const, domain: process.env.COOKIE_DOMAIN || undefined }; }
}
