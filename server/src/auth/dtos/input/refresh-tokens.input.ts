import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class RefreshTokensInput {
  @Field()
  @IsString()
  accessToken: string;

  @Field()
  @IsString()
  refreshToken: string;
}
