import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../users/service';
import { PermissionsProfile, PermissionsProfileGuard } from '../../utils/permissions/permissionProfile.guard';
import { User } from '../users/model';
import { GetUser } from '../../utils/user/getUser';
import { ProfileUpdateDto } from './dto/profie';
import { TransactionService } from '../transactions/service';
import { Pagination, type PaginationParams } from '../../utils/pagination/pagination.decorator';

@ApiBearerAuth()
@ApiTags('profile')
@Controller('api/profile')
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) { }

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsProfileGuard)
  @PermissionsProfile('view')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  async get(@GetUser() user: User) {
    return user;
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'), PermissionsProfileGuard)
  @PermissionsProfile('edit')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@GetUser() user: User, @Body() payload: ProfileUpdateDto) {
    return await this.userService.update(user.id, payload);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'), PermissionsProfileGuard)
  @PermissionsProfile('delete')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  async delete(@GetUser() user: User) {
    await this.transactionService.deleteByUser(user.id);

    return await this.userService.delete(user.id);
  }

  @Get('transactions')
  @UseGuards(AuthGuard('jwt'), PermissionsProfileGuard)
  @PermissionsProfile('transactions')
  @ApiResponse({ status: 200, description: 'Patch User Request Received' })
  @ApiResponse({ status: 400, description: 'Patch User Request Failed' })
  async transactions(@GetUser() user: User, @Pagination() pagination: PaginationParams) {
    const result = await this.transactionService.pageByUserId(user.id, pagination);

    result.items = result.items.map((data) => {
      delete data.user;

      return data;
    });

    return result;
  }
}
