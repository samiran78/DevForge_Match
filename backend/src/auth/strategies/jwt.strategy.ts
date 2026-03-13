import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService, TokenPayload } from '../auth.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    });
  }

  async validate(payload: TokenPayload) {
    if (payload.type !== 'access') throw new UnauthorizedException();
    const user = await this.usersService.findById(payload.sub);
    if (!user?.isActive) throw new UnauthorizedException();
    return user;
  }
}
