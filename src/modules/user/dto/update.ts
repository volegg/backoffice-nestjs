import { PartialType } from '@nestjs/mapped-types';
import { UserCreateDto } from './create';
import { PickType } from '@nestjs/swagger';

export class UserUpdateDto extends PartialType(UserCreateDto) { }

export class UserOwnUpdateDto extends PickType(UserCreateDto, ['name']) { }
