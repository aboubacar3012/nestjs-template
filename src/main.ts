// src/main.ts

import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Utilisation de la classe ValidationPipe pour valider les données entrantes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Utilisation de la classe ClassSerializerInterceptor pour transformer les objets en JSON
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Configuration de Swagger pour générer la documentation de l'API
  const config = new DocumentBuilder()
    .setTitle('Elyamaje API')
    .setDescription('API elyamaje play avec NestJS')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();
