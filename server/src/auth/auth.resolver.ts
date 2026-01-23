import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dtos/input/login-user.input';
import { RegisterInput } from './dtos/input/register-user.input';
import { Auth, AuthDocument } from './auth.schema';
import { BaseResponseAuth } from './dtos/response/base-response.auth.response';
import { RegisterResponse } from './dtos/response/register.response';
import { LoginResponse } from './dtos/response/login.response';
import { CurrentUser } from 'src/common/decorators/current_user/current_user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthGuard } from './gql.authguard';
import { RefreshAccessTokenResponse } from './dtos/response/refresh-access-token.response';
import { RefreshTokensInput } from './dtos/input/refresh-tokens.input';
import { RefreshTokensResponse } from './dtos/response/refresh-tokens.response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => [BaseResponseAuth])
  async getAllAuth(): Promise<AuthDocument[]> {
    const allUsers = await this.authService.getAllAuth();
    return allUsers;
  }

  @Query(() => BaseResponseAuth)
  @UseGuards(GqlAuthGuard)
  async getMe(@CurrentUser('id') userId: string): Promise<AuthDocument> {
    console.log('here', userId);
    const result = await this.authService.findById(userId);
    return result;
  }

  @Mutation(() => RefreshAccessTokenResponse)
  async refreshAccessToken(@Args('refreshToken') refreshToken: string) {
    const result =
      await this.authService.refreshAccessTokenService(refreshToken);
    return result;
  }

  @Mutation(() => RefreshTokensResponse)
  async refreshTokens(@Args('tokens') refreshTokensInput: RefreshTokensInput) {
    const result =
      await this.authService.refreshTokensService(refreshTokensInput);
    return result;
  }

  @Mutation(() => RegisterResponse)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    const result = await this.authService.register(registerInput);
    return { user: result };
  }

  @Mutation(() => LoginResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    console.log('loginInput', loginInput);
    const result = await this.authService.login(loginInput);

    console.log('result', result);
    return result;
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard('jwt'))
  async logout(@CurrentUser('sub') userId: string) {
    return this.authService.logout(userId);
  }
}
