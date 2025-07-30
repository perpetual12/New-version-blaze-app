#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment..."

# Load environment variables
if [ -f .env ]; then
  echo "🔧 Loading environment variables from .env file"
  export $(grep -v '^#' .env | xargs)
else
  echo "⚠️  Warning: .env file not found"
  echo "ℹ️  Please make sure all required environment variables are set"
fi

# Build the application
echo "🔨 Building the application..."
docker-compose build

# Stop and remove existing containers
echo "🛑 Stopping and removing existing containers..."
docker-compose down || true

# Start the application
echo "🚀 Starting the application..."
docker-compose up -d

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running on http://localhost:5001"
echo "📊 MongoDB Express is available at http://localhost:8081"
