import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from './users.service';
import { Response, Request } from 'express';
import * as QRCode from 'qrcode';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly users: UsersService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.auth.register(body.username, body.password);
    return user;
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.auth.login(body.username, body.password, body.totp);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: Request) {
    const user = await this.auth.getProfile((req as any).user.userId);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/setup')
  async mfaSetup(@Req() req: Request) {
    const userProfile = await this.auth.getProfile((req as any).user.userId);
    const username = userProfile!.username;
    const user = (await this.users.findByUsername(username))!;
    const { otpauthUrl, base32 } = this.auth.generateMfaSecret(user);
    const qr = await QRCode.toDataURL(otpauthUrl);
    return { otpauthUrl, base32, qrDataUrl: qr };
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/verify')
  async mfaVerify(@Req() req: Request, @Body('token') token: string) {
    const userProfile = await this.auth.getProfile((req as any).user.userId);
    const username = userProfile!.username;
    const user = (await this.users.findByUsername(username))!;
    const ok = this.auth.verifyTotp(user, token);
    if (ok) {
      this.auth.enableMfa(username);
      return { success: true };
    }
    return { success: false };
  }
}


