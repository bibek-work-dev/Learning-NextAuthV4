import { AuthService } from './auth.service';
import { AccessTokenJwtPayload } from 'src/common/types/accessToken.type';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(payload: AccessTokenJwtPayload): Promise<import("./auth.schema").AuthDocument | null>;
}
export {};
