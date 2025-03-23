import { Module } from '@nestjs/common';
import { UserService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model';
import { UserController } from './controller';
import { TransactionService } from '../transactions/service';
import { Transaction, TransactionSchema } from '../transactions/model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],
  providers: [
    UserService,
    TransactionService,
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule { }
