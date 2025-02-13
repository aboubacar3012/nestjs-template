//src/prisma-client-exception.filter.ts

import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      // Erreurs d'authentification et connexion
      case 'P1000':
      case 'P1010': {
        const status = HttpStatus.UNAUTHORIZED;
        response.status(status).json({
          statusCode: status,
          message: "Erreur d'authentification à la base de données",
        });
        break;
      }

      // Erreurs de connexion à la base de données
      case 'P1001':
      case 'P1002':
      case 'P1017': {
        const status = HttpStatus.SERVICE_UNAVAILABLE;
        response.status(status).json({
          statusCode: status,
          message: 'La base de données est temporairement indisponible',
        });
        break;
      }

      // Erreurs de ressources non trouvées
      case 'P1003':
      case 'P1014': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: 'Ressource non trouvée',
        });
        break;
      }

      // Erreurs de timeout
      case 'P1008': {
        const status = HttpStatus.REQUEST_TIMEOUT;
        response.status(status).json({
          statusCode: status,
          message: 'La requête a expiré',
        });
        break;
      }

      // Erreurs de conflit
      case 'P1009': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: 'Conflit de ressources',
        });
        break;
      }

      // Erreurs de validation du schéma
      case 'P1012':
      case 'P1013':
      case 'P1015':
      case 'P1016': {
        const status = HttpStatus.BAD_REQUEST;
        response.status(status).json({
          statusCode: status,
          message: 'Erreur de validation des données',
        });
        break;
      }

      // Erreurs de sécurité TLS
      case 'P1011': {
        const status = HttpStatus.FORBIDDEN;
        response.status(status).json({
          statusCode: status,
          message: 'Erreur de sécurité TLS',
        });
        break;
      }

      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: 'Un enregistrement avec cette valeur existe déjà',
        });
        break;
      }

      case 'P2025': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: message,
        });
        break;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }
}
