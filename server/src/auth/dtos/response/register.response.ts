import { ObjectType, Field } from '@nestjs/graphql';
import { BaseResponseAuth } from './base-response.auth.response';

@ObjectType()
export class RegisterResponse {
  @Field(() => BaseResponseAuth)
  user: BaseResponseAuth;
}
