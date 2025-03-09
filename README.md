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

## Endpoints disponibles

- `GET /api/articles` - Récupère la liste paginée des articles publiés
- `GET /api/articles/drafts` - Récupère la liste des articles en brouillon
- `GET /api/articles/:id` - Récupère un article par son identifiant
- `POST /auth/login` - Authentifie un utilisateur et retourne un token JWT
- `GET /users` - Récupère la liste paginée des utilisateurs (nécessite un token JWT)
- `GET /users/:id` - Récupère un utilisateur par son identifiant (nécessite un token JWT)
- `POST /users` - Crée un nouvel utilisateur
- `PATCH /users/:id` - Met à jour un utilisateur par son identifiant (nécessite un token JWT)
- `DELETE /users/:id` - Supprime un utilisateur par son identifiant (nécessite un token JWT)

## Modules communs utilisés

- `nestjs-prisma` - Intégration de Prisma avec NestJS
- `nestjs/swagger` - Génération de la documentation API avec Swagger
- `nestjs/jwt` - Gestion de l'authentification avec JWT

## Authentification avec JWT

L'authentification est gérée via des tokens JWT. Les utilisateurs peuvent se connecter via l'endpoint `POST /auth/login` en fournissant leur email et mot de passe. Si les informations sont correctes, un token JWT est retourné. Ce token doit être inclus dans les requêtes suivantes dans le header `Authorization` sous la forme `Bearer <token>`.

Le `JwtAuthGuard` est utilisé pour protéger les endpoints nécessitant une authentification. Il vérifie la validité du token JWT et permet l'accès aux ressources protégées.

## Licence

[MIT](LICENSE)
