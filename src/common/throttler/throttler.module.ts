/**
 * Module de configuration de throttling.
 * Ce module configure la limitation du nombre de requêtes autorisées
 * en utilisant le module Throttler de NestJS.
 *
 * ttl: durée en secondes pendant laquelle le compteur de requêtes est valide.
 * limit: nombre maximal de requêtes autorisées dans le ttl défini.
 */

import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),
  ],
})
export class ThrottlerConfigModule {}
