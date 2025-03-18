import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsAlphanumeric,
  MinLength,
} from 'class-validator';
import { UserRegisterDto } from '../../auth/dto/register';
import { AppRoles } from 'const';

export class UserCreateDto extends UserRegisterDto {
  @ApiProperty()
  roles: AppRoles[];

  @ApiProperty()
  permissions: string[];

  @ApiProperty()
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
