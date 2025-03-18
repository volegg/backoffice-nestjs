import { Module } from '@nestjs/common';
import { TransactionService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction } from './model';
import { TransactionController } from './controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Transaction', schema: Transaction }])],
  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController],
})

export class TransactionModule { }
