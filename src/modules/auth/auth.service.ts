import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { UserService } from '../users/service';
import type { User } from '../users/model';
import { LoginDto } from './dto/login';

export type ITokenReturnBody = {
  expires: number;
  token: string;
}

@Injectable()
export class AuthService {
  private readonly expiration: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.expiration = parseInt(this.configService.get('WEBTOKEN_EXPIRATION_TIME'), 10);
  }

  async createToken({
    _id,
    email,
  }: User): Promise<ITokenReturnBody> {
    return {
      expires: this.expiration,
      token: this.jwtService.sign({ _id, email }),
    };
  }

  async validateUser(payload: LoginDto): Promise<User> {
    const user = await this.userService.getByUsernameAndPass(
      payload.email,
      payload.password,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Could not authenticate. Please try again.',
      );
    }
    return user;
  }
}
