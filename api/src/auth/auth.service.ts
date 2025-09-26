import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UserRecord } from './types';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

  async register(username: string, password: string): Promise<{ id: number; username: string }> {
    const user = await this.users.createUser(username, password);
    return { id: user.id, username: user.username };
  }

  async login(username: string, password: string, totp?: string): Promise<{ accessToken: string } | { mfaRequired: true }> {
    const user = await this.users.validatePassword(username, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.mfaEnabled) {
      if (!totp) {
        return { mfaRequired: true } as const;
      }
      const verified = this.verifyTotp(user, totp);
      if (!verified) throw new UnauthorizedException('Invalid MFA code');
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken };
  }

  generateMfaSecret(user: UserRecord): { otpauthUrl: string; base32: string } {
    const secret = speakeasy.generateSecret({
      name: `MFA Demo (${user.username})`,
      length: 20,
    });
    this.users.setMfaSecret(user.username, secret.base32);
    return { otpauthUrl: secret.otpauth_url!, base32: secret.base32 };
  }

  verifyTotp(user: UserRecord, token: string): boolean {
    if (!user.mfaSecret) return false;
    return speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 1,
    });
  }

  enableMfa(username: string): void {
    this.users.enableMfa(username);
  }

  async getProfile(userId: number): Promise<{ id: number; username: string; mfaEnabled: boolean } | undefined> {
    const user = await this.users.findById(userId);
    if (!user) return undefined;
    return { id: user.id, username: user.username, mfaEnabled: user.mfaEnabled };
  }
}


