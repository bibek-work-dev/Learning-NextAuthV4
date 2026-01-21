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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const auth_schema_1 = require("./auth.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const error_1 = require("graphql/error");
const bcrypt = require("bcrypt");
const token_service_1 = require("./token.service");
let AuthService = class AuthService {
    AuthModel;
    tokenService;
    constructor(AuthModel, tokenService) {
        this.AuthModel = AuthModel;
        this.tokenService = tokenService;
    }
    async register(registerInput) {
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
            throw new error_1.GraphQLError('Some failure happened');
        }
        return createdUser;
    }
    async login(loginInput) {
        const { email, password } = loginInput;
        console.log('email and password', loginInput);
        const user = await this.AuthModel.findOne({ email });
        if (!user) {
            throw new error_1.GraphQLError('No such email found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new error_1.GraphQLError('Invalid password');
        }
        const accessToken = this.tokenService.generateAccessToken(user);
        const refreshToken = this.tokenService.generateRefreshToken(user);
        user.refreshToken = refreshToken;
        user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await user.save();
        return { user, accessToken };
    }
    async getAllAuth() {
        const result = await this.AuthModel.find();
        return result;
    }
    async findById(id) {
        const result = await this.AuthModel.findById(id);
        console.log('result', result);
        if (!result) {
            throw new error_1.GraphQLError('Not found');
        }
        return result;
    }
    async refreshAccessTokenService(refreshToken) {
        let payload;
        try {
            payload = this.tokenService.verifyRefreshToken(refreshToken);
        }
        catch (err) {
            throw new error_1.GraphQLError('Invalid refresh token');
        }
        const user = await this.findById(payload.sub);
        if (!user || !user.refreshToken) {
            throw new error_1.GraphQLError('Refresh token not found');
        }
        if (user.refreshToken !== refreshToken) {
            throw new error_1.GraphQLError('Refresh token mismatch');
        }
        if (user.refreshTokenExpiresAt != null &&
            user.refreshTokenExpiresAt < new Date()) {
            throw new error_1.GraphQLError('Refresh token expired');
        }
        const newAccessToken = this.tokenService.generateAccessToken(user);
        return { newAccessToken };
    }
    async refreshTokensService(refreshTokensInput) {
        const { accessToken, refreshToken } = refreshTokensInput;
        let payload;
        try {
            payload = this.tokenService.verifyRefreshToken(refreshToken);
        }
        catch (err) {
            throw new error_1.GraphQLError('Invalid refresh token');
        }
        const user = await this.findById(payload.sub);
        if (!user || !user.refreshToken) {
            throw new error_1.GraphQLError('Refresh token not found');
        }
        if (user.refreshToken !== refreshToken) {
            throw new error_1.GraphQLError('Refresh token mismatch');
        }
        if (user.refreshTokenExpiresAt != null &&
            user.refreshTokenExpiresAt < new Date()) {
            throw new error_1.GraphQLError('Refresh token expired');
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
    async logout(userId) {
        const user = await this.findById(userId);
        user.refreshToken = null;
        user.refreshTokenExpiresAt = null;
        await user.save();
        return 'Logged out successfully';
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(auth_schema_1.Auth.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        token_service_1.TokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map