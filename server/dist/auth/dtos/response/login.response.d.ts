import { BaseResponseAuth } from './base-response.auth.response';
export declare class LoginResponse {
    user: BaseResponseAuth;
    accessToken: string;
    refreshToken: string;
}
