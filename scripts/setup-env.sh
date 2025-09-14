#!/bin/bash

# Setup environment files for Zesdocs development
echo "🔧 Setting up environment files for Zesdocs development..."

# Function to copy env.example to .env if it doesn't exist
copy_env_file() {
    local workspace=$1
    local env_file="$workspace/env.example"
    local target_file="$workspace/.env"
    
    if [ -f "$env_file" ]; then
        if [ ! -f "$target_file" ]; then
            cp "$env_file" "$target_file"
            echo "✅ Created $target_file"
        else
            echo "⚠️  $target_file already exists, skipping..."
        fi
    else
        echo "❌ $env_file not found, skipping..."
    fi
}

# Copy environment files for each workspace
echo "📁 Copying environment files..."

copy_env_file "apps/api"
copy_env_file "apps/web"
copy_env_file "apps/indexer"
copy_env_file "apps/extension"
copy_env_file "apps/mobile"
copy_env_file "packages/shared"
copy_env_file "infra"

# Create root .env file
if [ ! -f ".env" ]; then
    cp "env.example" ".env"
    echo "✅ Created root .env file"
else
    echo "⚠️  Root .env already exists, skipping..."
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Review and update the .env files in each workspace"
echo "2. Update the root .env file with your specific configuration"
echo "3. Start the infrastructure: cd infra && pnpm run dev:start"
echo "4. Start the applications: pnpm run dev"
echo ""
echo "🔐 Important: Update all JWT_SECRET and API keys before running in production!"
