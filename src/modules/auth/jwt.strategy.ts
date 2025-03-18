import { ExtractJwt, JwtPayload, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '../config/config.service';
import { UserService } from '../user/service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('WEBTOKEN_SECRET_KEY'),
    });
  }

  async validate({ iat, exp, _id }: JwtPayload, done): Promise<boolean> {
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.get(_id);
    if (!user) {
      throw new UnauthorizedException();
    }

    done(null, user);
    return true;
  }
}
