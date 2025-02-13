// src/main.ts

import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware global
  // Utilisation de la classe ValidationPipe pour valider les données entrantes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // Utilisation de la classe ClassSerializerInterceptor pour transformer les objets en JSON
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Configuration de Swagger pour générer la documentation de l'API
  const config = new DocumentBuilder()
    .setTitle('Template API')
    .setDescription('API template play avec NestJS')
    .setContact('template', 'https://template.com', 'contact@template.com')
    .setVersion('0.1')
    .addBearerAuth()
    // .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' }) // Ajout d'un API Key
    .addServer('http://localhost:3000')
    .addServer('https://api.template.com')
    .addTag('users', 'Gestion des utilisateurs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Gestion des exceptions Prisma
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Démarrage de l'application
  await app.listen(3000);
}

// Initialisation de l'application
bootstrap();
