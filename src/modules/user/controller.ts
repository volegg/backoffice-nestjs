import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService, IGenericMessageBody } from './service';
import { UserUpdateDto } from './dto/update';
import { IsOwner, Permissions, PermissionsGuard } from 'utils/permission.guard';
import type { User } from './model';
import { UserRegisterDto } from './dto/register';

@ApiBearerAuth()
@ApiTags('users')
@Controller('api/users')
export class UserController {
  constructor(private readonly service: UserService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:any')
  @ApiResponse({ status: 200, description: 'Fetch User Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch User Request Failed' })
  async page(@Query('offset') offset: number, @Query('limit') limit: number): Promise<User[]> {
    return await this.service.page(offset, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read', 'read:any')
  @IsOwner('id')
  @ApiResponse({ status: 200, description: 'Fetch User Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch User Request Failed' })
  async get(@Param('id') id: string): Promise<User> {
    const user = await this.service.get(id);

    if (!user) {
      throw new BadRequestException(
        `The user with id ${id}  not be found.`,
      );
    }

    return user;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  async create(@Body() payload: UserRegisterDto) {
    return await this.service.createStandart(payload);
  }

  @Post('/admin')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  async createAdmin(@Body() payload: UserRegisterDto) {
    return await this.service.createAdmin(payload);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('udpate', 'update:any')
  @IsOwner('id')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() payload: UserUpdateDto) {
    return await this.service.edit(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete', 'delete:any')
  @ApiResponse({ status: 200, description: 'Delete User Request Received' })
  @ApiResponse({ status: 400, description: 'Delete User Request Failed' })
  async delete(
    @Param('id') id: string,
  ): Promise<IGenericMessageBody> {
    return await this.service.delete(id);
  }
}
