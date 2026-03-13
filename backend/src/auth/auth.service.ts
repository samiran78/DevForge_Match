import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { RefreshToken } from './entities/refresh-token.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user?.passwordHash) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  async login(user: User): Promise<AuthTokens> {
    return this.generateTokens(user);
  }

  async register(
    email: string,
    password: string,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already registered');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.usersService.create({
      email,
      passwordHash,
    });

    const tokens = await this.generateTokens(user);
    return { user, tokens };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    let payload: { jti?: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const jti = payload?.jti;
    if (!jti) throw new UnauthorizedException('Invalid refresh token');
    const stored = await this.refreshTokenRepo.findOne({
      where: { token: jti },
      relations: ['user'],
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    await this.refreshTokenRepo.delete({ id: stored.id });
    return this.generateTokens(stored.user);
  }

  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      try {
        const payload = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        });
        if (payload?.jti) await this.refreshTokenRepo.delete({ token: payload.jti });
      } catch {
        // Token invalid/expired - nothing to revoke
      }
    }
  }

  async handleGithubOAuth(profile: {
    id: string;
    username: string;
    emails?: { value: string }[];
    photos?: { value: string }[];
  }): Promise<{ user: User; tokens: AuthTokens; isNew: boolean }> {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new UnauthorizedException('GitHub profile has no email');

    let user = await this.usersService.findByGithubId(profile.id);
    if (!user) {
      user = await this.usersService.findByEmail(email);
      if (user) {
        await this.usersService.linkGithub(user.id, profile.id, profile.username);
      } else {
        user = await this.usersService.create({
          email,
          githubId: profile.id,
          githubUsername: profile.username,
          avatarUrl: profile.photos?.[0]?.value,
        });
      }
    }
    const tokens = await this.generateTokens(user);
    return { user, tokens, isNew: !user.profileComplete };
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const accessPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };
    const refreshPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(accessPayload);
    const refreshToken = uuidv4();
    const expiresIn = 900; // 15 min in seconds

    const refreshExpires = new Date();
    refreshExpires.setDate(refreshExpires.getDate() + 7);

    await this.refreshTokenRepo.save({
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshExpires,
    });

    const signedRefresh = this.jwtService.sign(
      { ...refreshPayload, jti: refreshToken },
      { secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken: signedRefresh,
      expiresIn,
    };
  }
}
