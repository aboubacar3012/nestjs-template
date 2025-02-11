# Utiliser l'image officielle de Node.js v20.18.1 basée sur Alpine Linux
FROM node:20.18.1-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Définir la variable d'environnement pour la base de données
ENV DATABASE_URL="postgresql://neondb_owner:npg_WR9buFfMGw1L@ep-summer-block-a2l9o0sf-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Copier le reste du code de l'application
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Construire l'application NestJS
RUN npm run build

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "start:prod"]
