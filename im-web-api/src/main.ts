import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cors from 'cors'
import { ConfigKeys } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://immediatememory.netlify.app']
  })
  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get<number>(ConfigKeys.port) as number

  await app.listen(process.env.PORT || port);
}
bootstrap();
