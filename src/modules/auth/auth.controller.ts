import { Controller, Body, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, ITokenReturnBody } from './auth.service';
import { LoginDto } from './dto/login';
import { UserRegisterDto } from './dto/register';
import { UserService } from '../user/service';

@Controller('api/auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Login Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() payload: LoginDto): Promise<ITokenReturnBody> {
    const user = await this.authService.validateUser(payload);
    return await this.authService.createToken(user);
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'Registration Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() payload: UserRegisterDto): Promise<ITokenReturnBody> {
    const user = await this.userService.createStandart(payload);
    return await this.authService.createToken(user);
  }
}
