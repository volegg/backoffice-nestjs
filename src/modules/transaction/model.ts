import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TransactionStatus, TransactionSubType, TransactionType } from '../../const';
import { User } from '../../modules/user/model';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  autoIndex: true,
})
export class Transaction extends Document {
  @Prop({ required: true, enum: TransactionType })
    type: string;

  @Prop({ required: true, enum: TransactionSubType })
    subType: string;

  @Prop({ required: true })
    amount: number;

  @Prop({ required: true, enum: TransactionStatus })
    status: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
