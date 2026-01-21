"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configValidationSchema = void 0;
const Joi = require("joi");
exports.configValidationSchema = Joi.object({
    PORT: Joi.number().default(3001),
    APP_ENV: Joi.string()
        .valid('development', 'production', 'test', 'local')
        .default('local'),
    MONGO_URI: Joi.string().required(),
    ACCESSTOKEN_SECRET: Joi.string().required(),
    ACCESSTOKEN_EXPIRY: Joi.string().default('15m'),
    REFRESHTOKEN_SECRET: Joi.string().required(),
    REFRESHTOKEN_EXPIRY: Joi.string().default('7d'),
    BCRYPT_SALT_ROUNDS: Joi.number().default(10),
});
//# sourceMappingURL=config.schema.js.map