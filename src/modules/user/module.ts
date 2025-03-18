import { Module } from '@nestjs/common';
import { UserService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model';
import { UserController } from './controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule { }
