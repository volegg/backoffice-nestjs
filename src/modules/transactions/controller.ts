import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsOwner, Permissions, PermissionsGuard } from 'utils/permission.guard';
import { TransactionCreateDto } from './dto/create';
import { ITransaction } from './model';
import { TransactionService } from './service';

@ApiBearerAuth()
@ApiTags('transactions')
@Controller('api/transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read', 'read:any')
  @IsOwner('user')
  @ApiResponse({ status: 200, description: 'Fetch User Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch User Request Failed' })
  async getPage(@Query('offset') offset: number, @Query('limit') limit: number): Promise<ITransaction[]> {
    return this.service.getPage(offset, limit);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create')
  @ApiResponse({ status: 200, description: 'POST Transaction Request Received' })
  @ApiResponse({ status: 400, description: 'POST Transaction Request Failed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createTransaction(@Body() createTransactionDto: TransactionCreateDto) {
    return this.service.createTransaction(createTransactionDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read', 'read:any')
  @IsOwner('user')
  @ApiResponse({ status: 200, description: 'GET Transaction Request Received' })
  @ApiResponse({ status: 400, description: 'GET Transaction Request Failed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async get(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
