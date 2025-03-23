import { Module } from '@nestjs/common';
import { UserService } from '../users/service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/model';
import { Transaction, TransactionSchema } from '../transactions/model';
import { TransactionService } from '../transactions/service';
import { ProfileController } from './controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],
  providers: [UserService, TransactionService],
  controllers: [ProfileController],
})
export class ProfileModule { }
