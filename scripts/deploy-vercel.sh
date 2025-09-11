#!/bin/bash

echo "🚀 Deploying BoltAI to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure your database"
echo "3. Set up OAuth providers (optional)"
echo ""
echo "Environment variables to set:"
echo "- NEXTAUTH_URL: https://your-app.vercel.app"
echo "- NEXTAUTH_SECRET: your-secret-key"
echo "- DATABASE_URL: your-database-url"
echo "- OPENAI_API_KEY: your-openai-api-key"
echo "- GOOGLE_CLIENT_ID: your-google-client-id (optional)"
echo "- GOOGLE_CLIENT_SECRET: your-google-client-secret (optional)"
echo "- GITHUB_CLIENT_ID: your-github-client-id (optional)"
echo "- GITHUB_CLIENT_SECRET: your-github-client-secret (optional)"
echo ""
echo "Happy deploying! 🎉"