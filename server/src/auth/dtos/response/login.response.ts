import { ObjectType, Field } from '@nestjs/graphql';
import { BaseResponseAuth } from './base-response.auth.response';

@ObjectType()
export class LoginResponse {
  @Field(() => BaseResponseAuth)
  user: BaseResponseAuth;

  @Field(() => String)
  accessToken: string;

  @Field(() => String, { nullable: true })
  refreshToken: string;
}
