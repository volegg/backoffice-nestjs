import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITransaction } from './model';
import { TransactionCreateDto } from './dto/create';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction') private readonly model: Model<ITransaction>
  ) { }

  async createTransaction(createTransactionDto: TransactionCreateDto): Promise<ITransaction> {
    const newTransaction = new this.model(createTransactionDto);
    return newTransaction.save();
  }

  async getPage(offset: number, limit: number): Promise<ITransaction[]> {
    return this.model.find().skip(offset).limit(limit).populate('user').exec();
  }

  async getById(id: string): Promise<ITransaction> {
    const transaction = await this.model.findById(id).populate('user').exec();

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}
