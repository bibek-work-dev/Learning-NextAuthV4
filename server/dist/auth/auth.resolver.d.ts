import { AuthService } from './auth.service';
import { LoginInput } from './dtos/input/login-user.input';
import { RegisterInput } from './dtos/input/register-user.input';
import { AuthDocument } from './auth.schema';
import { RefreshTokensInput } from './dtos/input/refresh-tokens.input';
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    getAllAuth(): Promise<AuthDocument[]>;
    getMe(userId: string): Promise<AuthDocument>;
    refreshAccessToken(refreshToken: string): Promise<{
        newAccessToken: string;
    }>;
    refreshTokens(refreshTokensInput: RefreshTokensInput): Promise<{
        newAccessToken: string;
        newRefreshToken: string;
    }>;
    register(registerInput: RegisterInput): Promise<AuthDocument>;
    login(loginInput: LoginInput): Promise<{
        user: AuthDocument;
        accessToken: string;
    }>;
    logout(userId: string): Promise<string>;
}
