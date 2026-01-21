import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from './dtos/input/register-user.input';

@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: String, default: null })
  refreshToken: string | null;

  @Prop({ type: Date, default: null })
  refreshTokenExpiresAt: Date | null;

  @Prop({ type: Date, default: null })
  lastLogin: Date | null;

  @Prop({ default: 0 })
  loggedInTimes: number;
}

export type AuthDocument = Auth & Document;
export const AuthSchema = SchemaFactory.createForClass(Auth);
