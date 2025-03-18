import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { IUser } from './model';
import { UserUpdateDto } from './dto/update';
import { UserCreateDto } from './dto/create';
import { UserRegisterDto } from 'modules/auth/dto/register';
import { AppRoles } from 'const';
import { permissionsFor } from 'utils/permissions/permissions';

export interface IGenericMessageBody {
  message: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
  ) { }

  get(id: string): Promise<IUser> {
    return this.userModel.findById(id).exec();
  }

  getUsers(offset: number, limit: number): Promise<IUser[]> {
    return this.userModel.find().skip(offset).limit(limit).exec();
  }

  getByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne({ email }).exec();
  }

  getByUsernameAndPass(email: string, password: string): Promise<IUser> {
    return this.userModel
      .findOne({
        email,
        password: crypto.createHmac('sha256', password).digest('hex'),
      })
      .exec();
  }

  async createStandart(dto: UserRegisterDto): Promise<IUser> {
    const permission = permissionsFor('User');
    const transactionPermission = permissionsFor('Transaction');
    const standartDto = {
      ...dto,
      name: AppRoles.STANDART,
      roles: [AppRoles.STANDART],
      permissions: [permission.read, permission.update, transactionPermission.read],
    }

    return await this.create(standartDto);
  }

  async createAdmin(dto: UserRegisterDto): Promise<IUser> {
    const permission = permissionsFor('User');
    const transactionPermission = permissionsFor('Transaction');
    const adminDto = {
      ...dto,
      name: AppRoles.ADMIN,
      roles: [AppRoles.ADMIN],
      permissions: Object.values(permission).concat(Object.values(transactionPermission)),
    }

    return await this.create(adminDto);
  }

  async edit(id: string, dto: UserUpdateDto): Promise<IUser> {
    const user = await this.get(id);

    if (!user) {
      throw new BadRequestException(
        'The user does not exist.',
      );
    }

    await this.userModel.findByIdAndUpdate(id, dto).exec();

    return await this.get(id);
  }

  delete(id: string): Promise<IGenericMessageBody> {
    return this.userModel.deleteOne({ id }).then(user => {
      if (user.deletedCount === 1) {
        return { message: `Deleted ${id} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a user by id ${id}.`,
        );
      }
    });
  }

  private async create(dto: UserCreateDto): Promise<IUser> {
    const user = await this.getByEmail(dto.email);

    if (user) {
      throw new NotAcceptableException(
        'The account with email already exists.',
      );
    }

    const newUser = new this.userModel({
      ...dto,
      password: crypto.createHmac('sha256', dto.password).digest('hex'),
    });

    return newUser.save();
  }

}
