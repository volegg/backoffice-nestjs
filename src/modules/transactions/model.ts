import { Schema, Document } from 'mongoose';
import { TransactionStatus, TransactionSubType, TransactionType } from './const';

export const Transaction = new Schema({
  type: { type: String, required: true },
  subType: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: { type: String, ref: 'User', required: true },
});

export interface ITransaction extends Document {
  readonly _id: Schema.Types.ObjectId;

  readonly createdAt: Date;

  type: TransactionType;

  subType: TransactionSubType;

  amount: number;

  status: TransactionStatus;

  user: string;
}
