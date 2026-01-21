"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_service_1 = require("./auth.service");
const login_user_input_1 = require("./dtos/input/login-user.input");
const register_user_input_1 = require("./dtos/input/register-user.input");
const base_response_auth_response_1 = require("./dtos/response/base-response.auth.response");
const register_response_1 = require("./dtos/response/register.response");
const login_response_1 = require("./dtos/response/login.response");
const current_user_decorator_1 = require("../common/decorators/current_user/current_user.decorator");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const gql_authguard_1 = require("./gql.authguard");
const refresh_access_token_response_1 = require("./dtos/response/refresh-access-token.response");
const refresh_tokens_input_1 = require("./dtos/input/refresh-tokens.input");
const refresh_tokens_response_1 = require("./dtos/response/refresh-tokens.response");
let AuthResolver = class AuthResolver {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async getAllAuth() {
        const allUsers = await this.authService.getAllAuth();
        return allUsers;
    }
    async getMe(userId) {
        console.log('here', userId);
        const result = await this.authService.findById(userId);
        return result;
    }
    async refreshAccessToken(refreshToken) {
        const result = await this.authService.refreshAccessTokenService(refreshToken);
        return result;
    }
    async refreshTokens(refreshTokensInput) {
        const result = await this.authService.refreshTokensService(refreshTokensInput);
        return result;
    }
    async register(registerInput) {
        const result = await this.authService.register(registerInput);
        return result;
    }
    async login(loginInput) {
        const result = await this.authService.login(loginInput);
        console.log('result', result);
        return result;
    }
    async logout(userId) {
        return this.authService.logout(userId);
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Query)(() => [base_response_auth_response_1.BaseResponseAuth]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "getAllAuth", null);
__decorate([
    (0, graphql_1.Query)(() => base_response_auth_response_1.BaseResponseAuth),
    (0, common_1.UseGuards)(gql_authguard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "getMe", null);
__decorate([
    (0, graphql_1.Mutation)(() => refresh_access_token_response_1.RefreshAccessTokenResponse),
    __param(0, (0, graphql_1.Args)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "refreshAccessToken", null);
__decorate([
    (0, graphql_1.Mutation)(() => refresh_tokens_response_1.RefreshTokensResponse),
    __param(0, (0, graphql_1.Args)('tokens')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_tokens_input_1.RefreshTokensInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "refreshTokens", null);
__decorate([
    (0, graphql_1.Mutation)(() => register_response_1.RegisterResponse),
    __param(0, (0, graphql_1.Args)('registerInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_input_1.RegisterInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "register", null);
__decorate([
    (0, graphql_1.Mutation)(() => login_response_1.LoginResponse),
    __param(0, (0, graphql_1.Args)('loginInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_input_1.LoginInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "logout", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map