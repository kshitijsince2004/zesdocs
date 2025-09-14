#!/bin/bash

# Backup Zesdocs database
echo "💾 Creating database backup..."

# Create backups directory if it doesn't exist
mkdir -p backups

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/zesdocs_backup_${TIMESTAMP}.sql"

# Create backup
docker exec zesdocs_pg pg_dump -U zesdocs -d zesdocs > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database backup created: $BACKUP_FILE"
    echo "📁 Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "❌ Backup failed!"
    exit 1
fi
