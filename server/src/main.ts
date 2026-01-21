import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'], // frontend URL(s)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, // if using cookies / auth
  });

  app.use(passport.initialize());

  const PORT = process.env.PORT ?? 3001;
  await app.listen(PORT);
  console.log('It is running in port', PORT);
}
bootstrap();
