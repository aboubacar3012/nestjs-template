# NestJS Template avec Prisma

Ce projet est un template NestJS utilisant Prisma comme ORM.

## Prérequis

- Node.js (version recommandée : 18+)
- npm ou yarn
- Une base de données PostgreSQL (ou autre selon votre configuration Prisma)

## Installation

```bash
# Installation des dépendances
yarn install
```

## Configuration

1. Créez un fichier `.env` à la racine du projet
2. Configurez votre URL de base de données dans ce fichier:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"
   ```

## Base de données

```bash
# Création des migrations Prisma
npx prisma migrate dev --name "initial-migration"

# Génération du client Prisma
npx prisma generate

# Chargement des données de test (si nécessaire)
npx prisma db seed

# Interface d'administration Prisma
npx prisma studio
```

## Démarrer l'application

```bash
# Mode développement
yarn start:dev
# ou
npm run start:dev

# Mode production
yarn start:prod
# ou
npm run start:prod
```

## Tests

```bash
# Tests unitaires
yarn test
# ou
npm run test

# Tests e2e
yarn test:e2e
# ou
npm run test:e2e
```

## Génération de ressources

Pour générer rapidement des modules, contrôleurs et services:

```bash
npx nest generate resource
```

## Structure du projet

- `src/` - Code source de l'application
- `prisma/` - Schéma et migrations Prisma
- `test/` - Tests

## Licence

[MIT](LICENSE)
