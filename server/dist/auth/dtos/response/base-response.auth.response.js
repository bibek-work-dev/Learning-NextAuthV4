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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResponseAuth = void 0;
const graphql_1 = require("@nestjs/graphql");
const register_user_input_1 = require("../input/register-user.input");
let BaseResponseAuth = class BaseResponseAuth {
    id;
    name;
    role;
    email;
    password;
    createdAt;
    updatedAt;
};
exports.BaseResponseAuth = BaseResponseAuth;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], BaseResponseAuth.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], BaseResponseAuth.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => register_user_input_1.Role),
    __metadata("design:type", String)
], BaseResponseAuth.prototype, "role", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], BaseResponseAuth.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], BaseResponseAuth.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], BaseResponseAuth.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], BaseResponseAuth.prototype, "updatedAt", void 0);
exports.BaseResponseAuth = BaseResponseAuth = __decorate([
    (0, graphql_1.ObjectType)()
], BaseResponseAuth);
//# sourceMappingURL=base-response.auth.response.js.map