import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as crypto from 'crypto';
import { AppRoles } from 'const';

@Schema({
  timestamps: true,
  autoIndex: true,
})
export class User extends Document {
  @Prop({ required: true, unique: true })
    email: string;

  @Prop({ required: true, minlength: 6 })
    password: string;

  @Prop({ required: true })
    name: string;

  @Prop({ type: [String], enum: AppRoles, default: [AppRoles.standart] })
    roles: [AppRoles];

  @Prop({ type: [String], default: [] })
    permissions: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = crypto.createHmac('sha256', this.password).digest('hex')
  next();
});
