import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthDocument } from 'src/auth/auth.schema';
import { AccessTokenJwtPayload } from 'src/common/types/accessToken.type';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const user = request.user;

    console.log('user', user);

    if (!user) return null;

    return data ? user[data] : user;
  },
);
