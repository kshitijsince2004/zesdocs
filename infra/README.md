# Zesdocs Infrastructure

Infrastructure configuration and deployment scripts for Zesdocs.

## Features

- Docker Compose for local development
- Database backup scripts
- Environment configuration
- Deployment manifests

## Local Development

Start all infrastructure services:

```bash
pnpm run dev:up
```

Stop services:

```bash
pnpm run dev:down
```

View logs:

```bash
pnpm run dev:logs
```

## Services

- PostgreSQL (port 5432)
- Redis (port 6379)
- Elasticsearch (port 9200)

## Backup

Create database backup:

```bash
pnpm run backup
```
