# Zesdocs Indexer

Background service for link metadata extraction and indexing.

## Features

- Fetches web page content and metadata
- Extracts title, description, images
- Generates embeddings for search
- Updates search index

## Development

```bash
pnpm run dev
```

## Queue Processing

Consumes jobs from Redis queue to process link indexing tasks.
