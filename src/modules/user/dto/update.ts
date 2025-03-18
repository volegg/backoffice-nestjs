import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
  IsAlphanumeric,
} from 'class-validator';
import { AppRoles } from 'const';

export class UserUpdateDto {
  @ApiProperty()
  @IsAlphanumeric()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  roles: AppRoles[];

  @ApiProperty()
  permissions: string[];
}
