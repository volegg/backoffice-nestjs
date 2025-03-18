import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import headers from 'fastify-helmet';
import fastifyRateLimiter from 'fastify-rate-limit';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const SWAGGER_API_ROOT = 'api/docs';
export const SWAGGER_API_NAME = 'API';
export const SWAGGER_API_DESCRIPTION = 'API Description';
export const SWAGGER_API_CURRENT_VERSION = '1.0';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);
  app.enableCors();
  app.register(headers);
  app.register(fastifyRateLimiter, {
    max: 100,
    timeWindow: 60000,
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3333, '0.0.0.0');
})();
