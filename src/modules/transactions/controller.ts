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
import { TransactionService } from './service';
import { TransactionUpdateDto } from './dto/update';
import { Permissions, PermissionsGuard } from '../../utils/permissions/permission.guard';
import type { Transaction } from './model';
import { TransactionCreateDto } from './dto/create';
import { Pagination, type PaginationParams } from '../../utils/pagination/pagination.decorator';

@ApiBearerAuth()
@ApiTags('transactions')
@Controller('api/transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) { }

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
  async get(@Param('id') id: string): Promise<Transaction> {
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
  @Permissions('edit')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() payload: TransactionUpdateDto) {
    return await this.service.edit(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete')
  @ApiResponse({ status: 200, description: 'Delete User Request Received' })
  @ApiResponse({ status: 400, description: 'Delete User Request Failed' })
  async delete(@Param('id') id: string): Promise<Transaction> {
    return await this.service.delete(id);
  }
}
