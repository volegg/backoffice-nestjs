import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { User } from './model';
import { UserUpdateDto } from './dto/update';
import { UserCreateDto } from './dto/create';
import { UserRegisterDto } from './dto/register';
import { AppRoles } from '../../const';
import { pagination, Paginatted } from '../../utils/pagination/pagination';
import { PaginationParams } from '../../utils/pagination/pagination.decorator';
import { permissionList } from '../../utils/permissions/permissionList';
import { getRndName } from '../../utils/randomNames';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<User>,
  ) { }

  get(id: string): Promise<User> {
    return this.model.findById(id, { password: 0 }).exec();
  }

  page(config: PaginationParams): Promise<Paginatted<User>> {
    return pagination(this.model.find(), this.model.find(), config);
  }

  getByEmail(email: string): Promise<User> {
    return this.model.findOne({ email }).exec();
  }

  getByUsernameAndPass(email: string, password: string): Promise<User> {
    return this.model
      .findOne({
        email,
        password: crypto.createHmac('sha256', password).digest('hex'),
      })
      .exec();
  }

  async createStandart(dto: UserRegisterDto): Promise<User> {
    const standartDto = {
      ...dto,
      name: getRndName(),
      roles: [AppRoles.standart],
      permissions: permissionList.profileList,
    }

    return this.create(standartDto);
  }

  async createAdmin(dto: UserRegisterDto): Promise<User> {
    const adminDto: UserCreateDto = {
      ...dto,
      name: getRndName(),
      roles: [AppRoles.admin],
      permissions: permissionList.list,
    }

    return this.create(adminDto);
  }

  async update(id: string, dto: UserUpdateDto): Promise<User> {
    const user = await this.get(id);

    if (!user) {
      throw new BadRequestException(
        'The user does not exist.',
      );
    }

    Object.keys(dto).forEach((key) => {
      user[key] = dto[key];
    });

    try {
      await user.save();
    } catch (ex) {
      throw new BadRequestException(ex.message);
    }

    return this.get(id);
  }

  delete(id: string): Promise<User> {
    return this.model.findByIdAndDelete(id).exec();
  }

  private async create(dto: UserCreateDto): Promise<User> {
    const user = await this.getByEmail(dto.email);

    if (user) {
      throw new NotAcceptableException(
        'The profile with email already exists.',
      );
    }

    const newUser = new this.model(dto);

    return newUser.save();
  }

}
