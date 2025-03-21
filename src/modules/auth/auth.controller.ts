import { Controller, Body, Post, UsePipes, ValidationPipe, Get, UseGuards, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, ITokenReturnBody } from './auth.service';
import { LoginDto } from './dto/login';
import { UserService } from '../user/service';
import { RegisterDto } from './dto/register';
import { GetUser } from '../../utils/user/getUser';
import { User } from '../user/model';
import { Request } from 'express';

@Controller('api/auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'Fetch User Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch User Request Failed' })
  async getMe(@GetUser() user: User): Promise<User> {
    return user;
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Login Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() payload: LoginDto): Promise<ITokenReturnBody> {
    const user = await this.authService.validateUser(payload);

    return await this.authService.createToken(user);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: Request) {
    req.headers['authorization']?.replace('Bearer ', '');

    return { message: 'Logged out successfully' };
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'Registration Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() payload: RegisterDto): Promise<ITokenReturnBody> {
    const user = await this.userService.createStandart(payload);

    return await this.authService.createToken(user);
  }
}
