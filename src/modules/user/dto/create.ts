import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AppRoles } from 'const';
import { UserRegisterDto } from './register';

export class UserCreateDto extends UserRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    name: string;

  @ApiProperty({ enum: AppRoles, default: [AppRoles.standart] })
  @IsEnum(AppRoles)
    roles: AppRoles[];

  @ApiProperty({ type: [String], default: [] })
  @IsOptional()
    permissions?: string[];
}
