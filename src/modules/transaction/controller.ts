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
import { IsOwner, Permissions, PermissionsGuard } from 'utils/permission.guard';
import type { Transaction } from './model';
import { TransactionCreateDto } from './dto/create';

@ApiBearerAuth()
@ApiTags('transactions')
@Controller('api/transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:any')
  @ApiResponse({ status: 200, description: 'Fetch User Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch User Request Failed' })
  async getPage(@Query('offset') offset: number, @Query('limit') limit: number): Promise<Transaction[]> {
    return await this.service.getUsers(offset, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read', 'read:any')
  @IsOwner('id')
  @ApiResponse({ status: 200, description: 'Fetch User Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch User Request Failed' })
  async getOne(@Param('id') id: string): Promise<Transaction> {
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
  async create(@Body() payload: TransactionCreateDto) {
    return await this.service.create(payload);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('udpate', 'update:any')
  @IsOwner('id')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() payload: TransactionUpdateDto) {
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
