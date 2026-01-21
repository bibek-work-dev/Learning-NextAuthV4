import { ObjectType, Field } from '@nestjs/graphql';
import { BaseResponseAuth } from './base-response.auth.response';

@ObjectType()
export class RefreshTokensResponse {
  @Field(() => String)
  newAccessToken: string;

  @Field(() => String)
  newRefreshToken: string;
}
