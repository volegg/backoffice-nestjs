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
import { TransactionService, IGenericMessageBody } from './service';
import { TransactionUpdateDto } from './dto/update';
import { IsOwner, Permissions, PermissionsGuard } from '../../utils/permissions/permission.guard';
import type { Transaction } from './model';
import { TransactionCreateDto } from './dto/create';
import { GetUser } from '../../utils/user/getUser';
import { User } from '../../modules/user/model';

@ApiBearerAuth()
@ApiTags('transactions')
@Controller('api/transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('find')
  @IsOwner('user')
  @ApiResponse({ status: 200, description: 'Fetch User Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch User Request Failed' })
  async page(@Param('user') user: string, @Query('offset') offset: number, @Query('limit') limit: number): Promise<Transaction[]> {
    return await this.service.page(offset, limit, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read')
  @IsOwner('id')
  @ApiResponse({ status: 200, description: 'Fetch User Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch User Request Failed' })
  async get(@Param('id') id: string): Promise<Transaction> {
    const user = await this.service.get(id);

    if (!user) {
      throw new BadRequestException(
        `The user with id ${id}  not be found.`,
      );
    }

    return user;
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  async pageMy(@GetUser() user: User, @Query('offset') offset: number, @Query('limit') limit: number): Promise<Transaction[]> {
    return await this.service.pageMy(offset, limit, user.id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  async create(@Body() payload: TransactionCreateDto) {
    return await this.service.create(payload);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('update')
  @IsOwner('id')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() payload: TransactionUpdateDto) {
    return await this.service.edit(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete')
  @IsOwner('id')
  @ApiResponse({ status: 200, description: 'Delete User Request Received' })
  @ApiResponse({ status: 400, description: 'Delete User Request Failed' })
  async delete(@Param('id') id: string): Promise<IGenericMessageBody> {
    return await this.service.delete(id);
  }
}
