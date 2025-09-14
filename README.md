# Zesdocs - The Smart Link Hub

A comprehensive link management system that helps you organize, search, and discover your saved links with AI-powered features.

## Architecture

This is a monorepo containing all Zesdocs components:

- **Web App** (`apps/web`) - Next.js frontend with React Query and Tailwind CSS
- **API** (`apps/api`) - Node.js/Express backend with PostgreSQL and Redis
- **Indexer** (`apps/indexer`) - Background service for link metadata extraction
- **Browser Extension** (`apps/extension`) - Chrome/Firefox extension for quick capture
- **Mobile App** (`apps/mobile`) - React Native mobile application
- **Shared** (`packages/shared`) - Shared TypeScript types and utilities
- **Infrastructure** (`infra`) - Docker Compose and deployment configurations

## Quick Start

### Prerequisites

- Node.js 18+ 
- PNPM 8+
- Docker & Docker Compose

### Development Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start infrastructure services:
   ```bash
   cd infra
   pnpm run dev:up
   ```

3. Start all applications in development mode:
   ```bash
   pnpm run dev
   ```

### Individual Services

- Web App: http://localhost:3001
- API: http://localhost:3000
- Database: localhost:5432
- Redis: localhost:6379
- Elasticsearch: http://localhost:9200

## Development

This monorepo uses:
- **PNPM** for package management
- **Turbo** for build orchestration
- **TypeScript** for type safety
- **ESLint** for code quality

### Available Scripts

- `pnpm run dev` - Start all services in development mode
- `pnpm run build` - Build all packages
- `pnpm run lint` - Lint all packages
- `pnpm run test` - Run all tests
- `pnpm run clean` - Clean all build artifacts

## License

MIT
