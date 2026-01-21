import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from '../input/register-user.input';

@ObjectType()
export class BaseResponseAuth {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Role)
  role: Role;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
