import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req: Request) => {
        return req.headers.authorization?.split(' ')[1];
      },
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
      passReqToCallback: true,
    });
  }

  validate = async (req: Request) => {
    const accessToken = req.headers.authorization?.split(' ')?.[1] ?? '';

    if (!accessToken) {
      throw new UnauthorizedException();
    }
    try {
      const user = await this.authService.getUserByToken(accessToken);
      if (!user) throw new UnauthorizedException();

      return user;
    } catch (err) {
      throw new UnauthorizedException();
    }
  };
}
