import { Controller, Body, Post, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, ITokenReturnBody } from './auth.service';
import { LoginDto } from './dto/login';
import { UserService } from '../users/service';
import { RegisterDto } from './dto/register';
import { Request } from 'express';
import { TransactionService } from '../transactions/service';

@Controller('api/auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) { }

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

    // note: test purpose only, remove for production
    await this.transactionService.genearate(String(user.id));

    return await this.authService.createToken(user);
  }
}
