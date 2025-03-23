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
import { pagination, type Paginatted } from '../../utils/pagination/pagination';
import type { PaginationParams } from '../../utils/pagination/pagination.decorator';
import { TransactionStatus, TransactionSubType, TransactionType } from '../../const';
import { getRandomInt } from '../../utils/getRandomInt';

export interface IGenericMessageBody {
  message: string;
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private readonly model: Model<Transaction>,
  ) { }

  get(id: string): Promise<Transaction> {
    return this.model.findById(id).populate('user').exec();
  }

  page(config: PaginationParams): Promise<Paginatted<Transaction>> {
    return pagination(this.model.find().populate('user'), this.model.find().populate('user'), config);
  }

  pageByUserId(userId: string, config: PaginationParams): Promise<Paginatted<Transaction>> {
    const condition = userId ? { user: new Types.ObjectId(userId) } : undefined;

    return pagination(this.model.find(condition), this.model.find(condition), config);
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

  delete(id: string): Promise<Transaction> {
    return this.model.findByIdAndDelete(id).exec();
  }

  deleteByUser(id: string): Promise<void> {
    this.model.deleteMany({ user: new Types.ObjectId(id) }).exec();

    return;
  }

  async create(dto: TransactionCreateDto): Promise<Transaction> {
    if (typeof dto.user === 'string') {
      dto.user = new Types.ObjectId(dto.user);
    }

    const newUser = new this.model(dto);

    return newUser.save();
  }

  // note: test purpose only, remove for production
  async genearate(id: string) {
    if (Math.random() < 0.25) {
      return;
    }

    const len = getRandomInt(2, 40);

    for (let i = 0; i < len; i++) {
      await this.create(generate());
    }

    return;

    function generate(): TransactionCreateDto {
      const status: TransactionStatus = [TransactionStatus.completed, TransactionStatus.failed, TransactionStatus.pending][getRandomInt(0, 2)];
      const subType: TransactionSubType = [TransactionSubType.purchase, TransactionSubType.refund, TransactionSubType.reward][getRandomInt(0, 2)];

      return {
        status,
        subType,
        type: [TransactionType.credit, TransactionType.deposit][getRandomInt(0, 1)],
        user: new Types.ObjectId(id),
        amount: getRandomInt(10, 9999)
      }
    }
  }

}
