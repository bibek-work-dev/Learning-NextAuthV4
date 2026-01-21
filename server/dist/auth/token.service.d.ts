import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { AuthDocument } from './auth.schema';
import { ConfigService } from '@nestjs/config';
import { AccessTokenJwtPayload } from 'src/common/types/accessToken.type';
import { RefreshTokenJwtPayload } from 'src/common/types/refreshToken.type';
export declare class TokenService {
    private readonly jwtService;
    private readonly configService;
    private readonly accessTokenSecret;
    private readonly refreshTokenSecret;
    private readonly accessTokenExpiry;
    private readonly refreshTokenExpiry;
    private readonly bcryptSaltRounds;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateAccessToken(user: AuthDocument, options?: Omit<JwtSignOptions, 'secret'>): string;
    generateRefreshToken(user: AuthDocument, options?: Omit<JwtSignOptions, 'secret'>): string;
    generateAccessTokenAndRefreshToken(user: AuthDocument, accessOptions?: Omit<JwtSignOptions, 'secret'>, refreshOptions?: Omit<JwtSignOptions, 'secret'>): {
        accessToken: string;
        refreshToken: string;
    };
    verifyAccessToken(token: string, options?: Omit<JwtVerifyOptions, 'secret'>): AccessTokenJwtPayload;
    verifyRefreshToken(token: string, options?: Omit<JwtVerifyOptions, 'secret'>): RefreshTokenJwtPayload;
    hashString(data: string): Promise<string>;
    compareHash(data: string, hash: string): Promise<boolean>;
}
