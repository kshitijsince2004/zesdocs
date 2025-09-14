#!/bin/bash

# Stop Zesdocs infrastructure services
echo "🛑 Stopping Zesdocs infrastructure services..."

docker-compose -f docker-compose.dev.yml down

echo "✅ All services stopped!"
echo ""
echo "To remove volumes (WARNING: This will delete all data):"
echo "docker-compose -f docker-compose.dev.yml down -v"
