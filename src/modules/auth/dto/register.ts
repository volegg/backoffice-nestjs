import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
