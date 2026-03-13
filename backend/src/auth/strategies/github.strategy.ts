import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/auth/github/callback',
      scope: ['user:email', 'read:user'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<{ id: string; username: string; emails?: { value: string }[]; photos?: { value: string }[] }> {
    return {
      id: profile.id,
      username: profile.username,
      emails: profile.emails,
      photos: profile.photos,
    };
  }
}
