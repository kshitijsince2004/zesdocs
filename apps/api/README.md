# Zesdocs API

Node.js/Express backend API for Zesdocs - The Smart Link Hub.

## Features

- RESTful API with Express
- PostgreSQL database with Prisma ORM
- Redis for caching and queues
- JWT authentication
- BullMQ for background jobs

## Development

```bash
pnpm run dev
```

Runs on http://localhost:3000

## Environment Variables

See `.env.example` for required configuration.

## Database

Uses PostgreSQL with Prisma migrations:

```bash
npx prisma migrate dev
```
