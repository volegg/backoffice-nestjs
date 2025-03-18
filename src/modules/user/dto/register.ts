import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty()
  @IsEmail()
    email: string;

  @ApiProperty()
  @IsString()
  @Length(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain at least one letter and one number'
  })
    password: string;
}
