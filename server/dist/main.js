"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const passport = require("passport");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    });
    app.use(passport.initialize());
    const PORT = process.env.PORT ?? 3001;
    await app.listen(PORT);
    console.log('It is running in port', PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map