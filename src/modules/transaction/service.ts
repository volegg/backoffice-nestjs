import * as crypto from 'crypto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Transaction } from './model';
import { TransactionUpdateDto } from './dto/update';
import { TransactionCreateDto } from './dto/create';

export interface IGenericMessageBody {
  message: string;
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private readonly model: Model<Transaction>,
  ) { }

  get(id: string): Promise<Transaction> {
    return this.model.findById(id).exec();
  }

  getUsers(offset: number, limit: number): Promise<Transaction[]> {
    return this.model.find().skip(offset).limit(limit).exec();
  }

  getByEmail(email: string): Promise<Transaction> {
    return this.model.findOne({ email }).exec();
  }

  getByUsernameAndPass(email: string, password: string): Promise<Transaction> {
    return this.model
      .findOne({
        email,
        password: crypto.createHmac('sha256', password).digest('hex'),
      })
      .exec();
  }

  async edit(id: string, dto: TransactionUpdateDto): Promise<Transaction> {
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

  async create(dto: TransactionCreateDto): Promise<Transaction> {
    dto.user = new Types.ObjectId(dto.user);

    const newUser = new this.model(dto);

    return newUser.save();
  }

}
