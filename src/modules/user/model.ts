import { Schema, Document } from 'mongoose';
import { AppRoles } from 'const';

export const User = new Schema({
  email: { type: String, required: true },
  name: { type: String, minLength: 3 },
  password: { type: String, required: true },
  roles: [{ type: String, require: true }],
  permissions: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface IUser extends Document {
  readonly _id: Schema.Types.ObjectId;

  readonly email: string;

  readonly createdAt: Date;

  name: string;

  password: string;

  roles: AppRoles[];

  permissions: string[];
}
