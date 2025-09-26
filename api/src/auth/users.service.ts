import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRecord } from './types';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(username: string, password: string): Promise<UserRecord> {
    const existing = await this.prisma.user.findUnique({ where: { username } });
    if (existing) {
      throw new BadRequestException('Username already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({ data: { username, passwordHash } });
    return { id: user.id, username: user.username, passwordHash: user.passwordHash, mfaEnabled: user.mfaEnabled, mfaSecret: user.mfaSecret ?? undefined };
  }

  async validatePassword(username: string, password: string): Promise<UserRecord | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return { id: user.id, username: user.username, passwordHash: user.passwordHash, mfaEnabled: user.mfaEnabled, mfaSecret: user.mfaSecret ?? undefined };
  }

  async findByUsername(username: string): Promise<UserRecord | undefined> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) return undefined;
    return { id: user.id, username: user.username, passwordHash: user.passwordHash, mfaEnabled: user.mfaEnabled, mfaSecret: user.mfaSecret ?? undefined };
  }

  async findById(id: number): Promise<UserRecord | undefined> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return undefined;
    return { id: user.id, username: user.username, passwordHash: user.passwordHash, mfaEnabled: user.mfaEnabled, mfaSecret: user.mfaSecret ?? undefined };
  }

  async setMfaSecret(username: string, secretBase32: string): Promise<void> {
    await this.prisma.user.update({ where: { username }, data: { mfaSecret: secretBase32 } });
  }

  async enableMfa(username: string): Promise<void> {
    await this.prisma.user.update({ where: { username }, data: { mfaEnabled: true } });
  }
}


