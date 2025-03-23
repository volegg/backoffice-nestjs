import { OmitType } from '@nestjs/swagger';
import { UserCreateDto } from '../../../modules/users/dto/create';

export class ProfileUpdateDto extends OmitType(UserCreateDto, ['roles', 'permissions', 'email', 'password']) { }