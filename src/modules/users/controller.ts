import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './service';
import { UserUpdateDto } from './dto/update';
import { Permissions, PermissionsGuard } from '../../utils/permissions/permission.guard';
import type { User } from './model';
import { UserRegisterDto } from './dto/register';
import { Pagination, type PaginationParams } from '../../utils/pagination/pagination.decorator';
import { TransactionService } from '../transactions/service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('api/users')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly serviceTransaction: TransactionService,
  ) { }

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('find')
  @ApiResponse({ status: 200, description: 'Fetch User Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch User Request Failed' })
  async page(@Pagination() pagination: PaginationParams) {
    return await this.service.page(pagination);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('view')
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
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() payload: UserRegisterDto) {
    const user = await this.service.createStandart(payload);

    // note: test purpose only, remove for production
    await this.serviceTransaction.genearate(String(user.id));

    return user;
  }

  @Post('admin')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createAdmin(@Body() payload: UserRegisterDto) {
    const user = await this.service.createAdmin(payload);

    // note: test purpose only, remove for production
    await this.serviceTransaction.genearate(String(user.id));

    return user;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('edit')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() payload: UserUpdateDto) {
    return await this.service.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete')
  @ApiResponse({ status: 200, description: 'Delete User Request Received' })
  @ApiResponse({ status: 400, description: 'Delete User Request Failed' })
  async deleteMark(@Param('id') id: string): Promise<User> {
    await this.serviceTransaction.deleteByUser(id);

    return await this.service.delete(id);
  }
}
