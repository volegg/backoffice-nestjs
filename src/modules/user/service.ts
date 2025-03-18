import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { AppRoles } from 'const';
import { permissionsFor } from 'utils/permissions/permissions';
import { User } from './model';
import { UserUpdateDto } from './dto/update';
import { UserCreateDto } from './dto/create';
import { UserRegisterDto } from './dto/register';

export interface IGenericMessageBody {
  message: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<User>,
  ) { }

  get(id: string): Promise<User> {
    return this.model.findById(id).exec();
  }

  getUsers(offset: number, limit: number): Promise<User[]> {
    return this.model.find().skip(offset).limit(limit).exec();
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
    const permission = permissionsFor('User');
    const transactionPermission = permissionsFor('Transaction');
    const standartDto = {
      ...dto,
      name: AppRoles.standart,
      roles: [AppRoles.standart],
      permissions: [permission.read, permission.update, transactionPermission.read],
    }

    return this.create(standartDto);
  }

  async createAdmin(dto: UserRegisterDto): Promise<User> {
    const permission = permissionsFor('User');
    const transactionPermission = permissionsFor('Transaction');
    const adminDto = {
      ...dto,
      name: AppRoles.admin,
      roles: [AppRoles.admin],
      permissions: Object.values(permission).concat(Object.values(transactionPermission)),
    }

    return this.create(adminDto);
  }

  async edit(id: string, dto: UserUpdateDto): Promise<User> {
    const user = await this.get(id);

    if (!user) {
      throw new BadRequestException(
        'The user does not exist.',
      );
    }

    await this.model.findByIdAndUpdate(id, dto).exec();

    return this.get(id);
  }

  delete(id: string): Promise<IGenericMessageBody> {
    return this.model.deleteOne({ id }).then(user => {
      if (user.deletedCount === 1) {
        return { message: `Deleted ${id} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a user by id ${id}.`,
        );
      }
    });
  }

  private async create(dto: UserCreateDto): Promise<User> {
    const user = await this.getByEmail(dto.email);

    if (user) {
      throw new NotAcceptableException(
        'The account with email already exists.',
      );
    }

    const newUser = new this.model(dto);

    return newUser.save();
  }

}
