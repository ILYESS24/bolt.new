#!/bin/bash

# Universal deployment script for BoltAI
# Supports: Vercel, Railway, Render, Netlify, and custom servers

set -e

PLATFORM=${1:-"vercel"}

echo "🚀 Deploying BoltAI to $PLATFORM..."

case $PLATFORM in
  "vercel")
    echo "📦 Deploying to Vercel..."
    if ! command -v vercel &> /dev/null; then
      echo "Installing Vercel CLI..."
      npm install -g vercel
    fi
    vercel --prod
    ;;
    
  "railway")
    echo "🚂 Deploying to Railway..."
    if ! command -v railway &> /dev/null; then
      echo "Installing Railway CLI..."
      npm install -g @railway/cli
    fi
    railway login
    railway up
    ;;
    
  "render")
    echo "🎨 Deploying to Render..."
    echo "Please connect your GitHub repository to Render and configure the following:"
    echo "- Build Command: npm install && npx prisma generate && npm run build"
    echo "- Start Command: npm start"
    echo "- Environment: Node.js 18"
    ;;
    
  "netlify")
    echo "🌐 Deploying to Netlify..."
    if ! command -v netlify &> /dev/null; then
      echo "Installing Netlify CLI..."
      npm install -g netlify-cli
    fi
    netlify login
    netlify deploy --prod
    ;;
    
  "docker")
    echo "🐳 Building Docker image..."
    docker build -t boltai .
    echo "Docker image built successfully!"
    echo "Run with: docker run -p 3000:3000 boltai"
    ;;
    
  "custom")
    echo "🔧 Custom deployment..."
    echo "Building for production..."
    npm run build
    echo "Build completed! Upload the .next folder to your server."
    ;;
    
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Supported platforms: vercel, railway, render, netlify, docker, custom"
    exit 1
    ;;
esac

echo "✅ Deployment to $PLATFORM completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables"
echo "2. Configure your database"
echo "3. Set up OAuth providers (optional)"
echo ""
echo "🔑 Required environment variables:"
echo "- NEXTAUTH_URL: https://your-domain.com"
echo "- NEXTAUTH_SECRET: your-secret-key"
echo "- DATABASE_URL: your-database-url"
echo "- OPENAI_API_KEY: your-openai-api-key"
echo ""
echo "🎉 Happy deploying!"