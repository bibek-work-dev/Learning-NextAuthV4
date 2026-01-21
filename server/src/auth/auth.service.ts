import { Injectable } from '@nestjs/common';
import { LoginInput } from './dtos/input/login-user.input';
import { RegisterInput } from './dtos/input/register-user.input';
import { Auth, AuthDocument } from './auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GraphQLError } from 'graphql/error';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { RefreshTokenJwtPayload } from 'src/common/types/refreshToken.type';
import { RefreshTokensInput } from './dtos/input/refresh-tokens.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly AuthModel: Model<AuthDocument>,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerInput: RegisterInput): Promise<AuthDocument> {
    const { email, name, password, role } = registerInput;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdUser = await this.AuthModel.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    if (!createdUser) {
      throw new GraphQLError('Some failure happened');
    }

    return createdUser;
  }

  async login(loginInput: LoginInput): Promise<{
    user: AuthDocument;
    accessToken: string;
  }> {
    const { email, password } = loginInput;

    console.log('email and password', loginInput);

    const user = await this.AuthModel.findOne({ email });

    if (!user) {
      throw new GraphQLError('No such email found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new GraphQLError('Invalid password');
    }

    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);

    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    return { user, accessToken };
  }

  async getAllAuth(): Promise<AuthDocument[]> {
    const result = await this.AuthModel.find();
    return result;
  }

  async findById(id: string): Promise<AuthDocument> {
    const result = await this.AuthModel.findById(id);

    console.log('result', result);
    if (!result) {
      throw new GraphQLError('Not found');
    }
    return result;
  }

  async refreshAccessTokenService(
    refreshToken: string,
  ): Promise<{ newAccessToken: string }> {
    let payload: RefreshTokenJwtPayload;
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch (err) {
      throw new GraphQLError('Invalid refresh token');
    }
    const user = await this.findById(payload.sub);

    if (!user || !user.refreshToken) {
      throw new GraphQLError('Refresh token not found');
    }

    if (user.refreshToken !== refreshToken) {
      throw new GraphQLError('Refresh token mismatch');
    }

    if (
      user.refreshTokenExpiresAt != null &&
      user.refreshTokenExpiresAt < new Date()
    ) {
      throw new GraphQLError('Refresh token expired');
    }
    const newAccessToken = this.tokenService.generateAccessToken(user);

    return { newAccessToken };
  }

  async refreshTokensService(refreshTokensInput: RefreshTokensInput): Promise<{
    newAccessToken: string;
    newRefreshToken: string;
  }> {
    const { accessToken, refreshToken } = refreshTokensInput;
    let payload: RefreshTokenJwtPayload;

    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch (err) {
      throw new GraphQLError('Invalid refresh token');
    }

    const user = await this.findById(payload.sub);

    if (!user || !user.refreshToken) {
      throw new GraphQLError('Refresh token not found');
    }

    if (user.refreshToken !== refreshToken) {
      throw new GraphQLError('Refresh token mismatch');
    }

    if (
      user.refreshTokenExpiresAt != null &&
      user.refreshTokenExpiresAt < new Date()
    ) {
      throw new GraphQLError('Refresh token expired');
    }

    const newAccessToken = this.tokenService.generateAccessToken(user);
    const newRefreshToken = this.tokenService.generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    return {
      newAccessToken,
      newRefreshToken,
    };
  }

  async logout(userId: string): Promise<string> {
    const user = await this.findById(userId);

    user.refreshToken = null;
    user.refreshTokenExpiresAt = null;
    await user.save();

    return 'Logged out successfully';
  }
}
