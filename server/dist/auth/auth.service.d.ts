import { LoginInput } from './dtos/input/login-user.input';
import { RegisterInput } from './dtos/input/register-user.input';
import { AuthDocument } from './auth.schema';
import { Model } from 'mongoose';
import { TokenService } from './token.service';
import { RefreshTokensInput } from './dtos/input/refresh-tokens.input';
export declare class AuthService {
    private readonly AuthModel;
    private readonly tokenService;
    constructor(AuthModel: Model<AuthDocument>, tokenService: TokenService);
    register(registerInput: RegisterInput): Promise<AuthDocument>;
    login(loginInput: LoginInput): Promise<{
        user: AuthDocument;
        accessToken: string;
    }>;
    getAllAuth(): Promise<AuthDocument[]>;
    findById(id: string): Promise<AuthDocument>;
    refreshAccessTokenService(refreshToken: string): Promise<{
        newAccessToken: string;
    }>;
    refreshTokensService(refreshTokensInput: RefreshTokensInput): Promise<{
        newAccessToken: string;
        newRefreshToken: string;
    }>;
    logout(userId: string): Promise<string>;
}
