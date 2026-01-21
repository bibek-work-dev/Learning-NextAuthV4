import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  APP_ENV: Joi.string()
    .valid('development', 'production', 'test', 'local')
    .default('local'),

  // MongoDB
  MONGO_URI: Joi.string().required(),

  // JWT
  ACCESSTOKEN_SECRET: Joi.string().required(),
  ACCESSTOKEN_EXPIRY: Joi.string().default('15m'),
  REFRESHTOKEN_SECRET: Joi.string().required(),
  REFRESHTOKEN_EXPIRY: Joi.string().default('7d'),

  BCRYPT_SALT_ROUNDS: Joi.number().default(10),
});
