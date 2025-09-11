# Quick Start Guide

Get BoltAI up and running in minutes!

## 🚀 One-Click Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/boltai)

1. Click the button above
2. Connect your GitHub account
3. Add environment variables
4. Deploy!

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template)

1. Click the button above
2. Connect your GitHub account
3. Add environment variables
4. Deploy!

## 🔧 Manual Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### 1. Clone and Install

```bash
git clone https://github.com/your-username/boltai.git
cd boltai
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=file:./dev.db
OPENAI_API_KEY=your-openai-api-key

# Optional
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 3. Database Setup

```bash
npm run db:generate
npm run db:push
```

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 First Steps

1. **Create an account** - Sign up with email or OAuth
2. **Create your first project** - Use the AI prompt to generate code
3. **Explore the editor** - Try the Monaco editor with syntax highlighting
4. **Use the terminal** - Run commands and see output
5. **Share your project** - Make it public and share the link

## 🔑 Getting API Keys

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an account
3. Go to API Keys
4. Create a new secret key
5. Copy the key to your environment variables

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`

### GitHub OAuth (Optional)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`

## 🗄️ Database Options

### Development (SQLite)
```env
DATABASE_URL="file:./dev.db"
```

### Production (PostgreSQL)
```env
DATABASE_URL="postgresql://user:pass@host:port/db"
```

### Production (MySQL)
```env
DATABASE_URL="mysql://user:pass@host:port/db"
```

## 🚀 Deployment

### Vercel

```bash
npm run deploy:vercel
```

### Railway

```bash
npm run deploy railway
```

### Docker

```bash
docker build -t boltai .
docker run -p 3000:3000 boltai
```

## 🆘 Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check DATABASE_URL format
   - Ensure database is accessible
   - Run `npm run db:push`

2. **AI features not working**
   - Check OPENAI_API_KEY
   - Verify API key permissions
   - Check rate limits

3. **OAuth not working**
   - Verify redirect URIs
   - Check client ID/secret
   - Ensure HTTPS in production

### Getting Help

- Check the [Documentation](./README.md)
- Open an [Issue](https://github.com/your-username/boltai/issues)
- Join our [Discord](https://discord.gg/your-discord)

## 🎉 You're Ready!

Your BoltAI instance is now running! Start creating amazing projects with AI-powered code generation.

### Next Steps

1. **Explore templates** - Try different project types
2. **Customize the UI** - Modify the design to your liking
3. **Add integrations** - Connect with your favorite tools
4. **Share with others** - Invite team members to collaborate

Happy coding! 🚀