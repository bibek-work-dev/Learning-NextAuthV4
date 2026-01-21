import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { AuthDocument } from './auth.schema';
import { ConfigService } from '@nestjs/config';
import { AccessTokenJwtPayload } from 'src/common/types/accessToken.type';
import { RefreshTokenJwtPayload } from 'src/common/types/refreshToken.type';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';

@Injectable()
export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: StringValue;
  private readonly refreshTokenExpiry: StringValue;
  private readonly bcryptSaltRounds: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecret =
      this.configService.get<string>('ACCESSTOKEN_SECRET')!;
    this.refreshTokenSecret = this.configService.get<string>(
      'REFRESHTOKEN_SECRET',
    )!;
    this.accessTokenExpiry =
      this.configService.get<StringValue>('ACCESSTOKEN_EXPIRY')!;
    this.refreshTokenExpiry = this.configService.get<StringValue>(
      'REFRESHTOKEN_EXPIRY',
    )!;
    this.bcryptSaltRounds =
      this.configService.get<number>('BCRYPT_SALT_ROUNDS')!;
  }

  generateAccessToken(
    user: AuthDocument,
    options?: Omit<JwtSignOptions, 'secret'>,
  ): string {
    const payload: AccessTokenJwtPayload = {
      sub: user._id.toString(),
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload, {
      ...options,
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpiry,
    });
    return accessToken;
  }

  generateRefreshToken(
    user: AuthDocument,
    options?: Omit<JwtSignOptions, 'secret'>,
  ): string {
    const payload: RefreshTokenJwtPayload = {
      sub: user._id.toString(),
      email: user.email,
    };
    const refreshToken = this.jwtService.sign(payload, {
      ...options,
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiry,
    });
    return refreshToken;
  }

  generateAccessTokenAndRefreshToken(
    user: AuthDocument,
    accessOptions?: Omit<JwtSignOptions, 'secret'>,
    refreshOptions?: Omit<JwtSignOptions, 'secret'>,
  ): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.generateAccessToken(user, accessOptions),
      refreshToken: this.generateRefreshToken(user, refreshOptions),
    };
  }

  verifyAccessToken(
    token: string,
    options?: Omit<JwtVerifyOptions, 'secret'>,
  ): AccessTokenJwtPayload {
    return this.jwtService.verify<AccessTokenJwtPayload>(token, {
      secret: this.accessTokenSecret,
      ...options,
    });
  }

  verifyRefreshToken(
    token: string,
    options?: Omit<JwtVerifyOptions, 'secret'>,
  ): RefreshTokenJwtPayload {
    return this.jwtService.verify<RefreshTokenJwtPayload>(token, {
      secret: this.refreshTokenSecret,
      ...options,
    });
  }

  async hashString(data: string): Promise<string> {
    return bcrypt.hash(data, this.bcryptSaltRounds);
  }

  async compareHash(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}
