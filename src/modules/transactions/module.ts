import { Module } from '@nestjs/common';
import { TransactionService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './model';
import { TransactionController } from './controller';
import { User, UserSchema } from '../users/model';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Transaction.name, schema: TransactionSchema },
    { name: User.name, schema: UserSchema },
  ])],
  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule { }
