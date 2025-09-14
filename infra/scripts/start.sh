#!/bin/bash

# Start Zesdocs infrastructure services
echo "🚀 Starting Zesdocs infrastructure services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start services
docker-compose -f docker-compose.dev.yml up -d

echo "⏳ Waiting for services to be ready..."

# Wait for PostgreSQL
echo "📊 Waiting for PostgreSQL..."
until docker exec zesdocs_pg pg_isready -U zesdocs -d zesdocs > /dev/null 2>&1; do
    echo "   PostgreSQL is unavailable - sleeping"
    sleep 2
done
echo "✅ PostgreSQL is ready!"

# Wait for Redis
echo "🔴 Waiting for Redis..."
until docker exec zesdocs_redis redis-cli ping > /dev/null 2>&1; do
    echo "   Redis is unavailable - sleeping"
    sleep 2
done
echo "✅ Redis is ready!"

# Wait for Elasticsearch
echo "🔍 Waiting for Elasticsearch..."
until curl -f http://localhost:9200/_cluster/health > /dev/null 2>&1; do
    echo "   Elasticsearch is unavailable - sleeping"
    sleep 5
done
echo "✅ Elasticsearch is ready!"

echo ""
echo "🎉 All infrastructure services are running!"
echo ""
echo "📊 Services:"
echo "   PostgreSQL: localhost:5432"
echo "   Redis: localhost:6379"
echo "   Elasticsearch: http://localhost:9200"
echo "   Redis Commander: http://localhost:8081"
echo "   Elasticsearch Head: http://localhost:9100"
echo ""
echo "To stop services: docker-compose -f docker-compose.dev.yml down"
echo "To view logs: docker-compose -f docker-compose.dev.yml logs -f"
