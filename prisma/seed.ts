// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {},
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {},
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
    },
  });

  const post3 = await prisma.article.upsert({
    where: { title: 'Prisma Migrate is now Generally Available' },
    update: {},
    create: {
      title: 'Prisma Migrate is now Generally Available',
      body: 'We are thrilled to announce that Prisma Migrate is now Generally Available!',
      description:
        'Prisma Migrate is a database schema migration tool that simplifies evolving the database schema...',
      published: true,
    },
  });

  const post4 = await prisma.article.upsert({
    where: { title: 'Prisma Client 3.0 is now Generally Available' },
    update: {},
    create: {
      title: 'Prisma Client 3.0 is now Generally Available',
      body: 'We are excited to announce that Prisma Client 3.0 is now Generally Available!',
      description:
        'Prisma Client is an auto-generated and type-safe query builder that is tailored to your database schema...',
      published: true,
    },
  });

  console.log({ post1, post2, post3, post4 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    // close Prisma Client at the end
    prisma.$disconnect().catch((e) => {
      console.error('Failed to disconnect Prisma Client:', e);
    });
  });
