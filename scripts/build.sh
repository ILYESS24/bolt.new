#!/bin/bash

echo "🚀 Building BoltAI for production..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Run database migrations (if needed)
if [ "$NODE_ENV" = "production" ]; then
    echo "🗄️  Running database migrations..."
    npx prisma db push
fi

# Build the application
echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy to your cloud provider"
echo "2. Set up environment variables"
echo "3. Configure your database"
echo ""
echo "Happy deploying! 🎉"