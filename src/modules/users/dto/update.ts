import { PartialType } from '@nestjs/mapped-types';
import { UserCreateDto } from './create';

export class UserUpdateDto extends PartialType(UserCreateDto) { }

