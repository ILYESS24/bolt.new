# Environment Setup Guide

This guide explains how to set up BoltAI in different environments.

## Development Environment

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd boltai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure .env.local**
   ```env
   # Database (SQLite for development)
   DATABASE_URL="file:./dev.db"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # OpenAI (required)
   OPENAI_API_KEY="your-openai-api-key"
   
   # OAuth (optional)
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   GITHUB_CLIENT_ID=""
   GITHUB_CLIENT_SECRET=""
   ```

5. **Set up database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

### Docker Development

1. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - App: http://localhost:3000
   - Database: localhost:5432

## Production Environment

### Vercel Deployment

1. **Environment Variables**
   ```env
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-super-secret-key
   DATABASE_URL=postgresql://user:pass@host:port/db
   OPENAI_API_KEY=your-openai-api-key
   ```

2. **Deploy**
   ```bash
   npm run deploy:vercel
   ```

### Railway Deployment

1. **Environment Variables**
   ```env
   NEXTAUTH_URL=https://your-app.railway.app
   NEXTAUTH_SECRET=your-super-secret-key
   DATABASE_URL=postgresql://user:pass@host:port/db
   OPENAI_API_KEY=your-openai-api-key
   ```

2. **Deploy**
   ```bash
   npm run deploy railway
   ```

### Render Deployment

1. **Environment Variables**
   ```env
   NEXTAUTH_URL=https://your-app.onrender.com
   NEXTAUTH_SECRET=your-super-secret-key
   DATABASE_URL=postgresql://user:pass@host:port/db
   OPENAI_API_KEY=your-openai-api-key
   ```

2. **Deploy**
   - Connect GitHub repository
   - Set build command: `npm install && npx prisma generate && npm run build`
   - Set start command: `npm start`

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Your app's URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | `your-super-secret-key` |
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@host:port/db` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | `sk-...` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `your-google-secret` |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | `your-github-client-id` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | `your-github-secret` |
| `DIRECT_URL` | Direct database connection (some providers) | `postgresql://user:pass@host:port/db` |

## Database Configuration

### SQLite (Development)
```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL (Production)
```env
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"
```

### MySQL (Alternative)
```env
DATABASE_URL="mysql://username:password@host:port/database"
```

## OAuth Configuration

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Set Authorization callback URL:
   - Development: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://your-domain.com/api/auth/callback/github`

## Security Considerations

### Production Security

1. **Use strong secrets**
   ```bash
   # Generate a strong secret
   openssl rand -base64 32
   ```

2. **Enable HTTPS**
   - Use SSL certificates
   - Redirect HTTP to HTTPS

3. **Database Security**
   - Use connection pooling
   - Enable SSL connections
   - Restrict database access

4. **API Security**
   - Rate limiting
   - Input validation
   - Error handling

### Environment Security

1. **Never commit secrets**
   - Use `.env.local` for local development
   - Use platform environment variables for production

2. **Rotate secrets regularly**
   - Change NEXTAUTH_SECRET periodically
   - Rotate API keys

3. **Monitor access**
   - Check logs regularly
   - Monitor for suspicious activity

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check firewall settings

2. **OAuth not working**
   - Verify redirect URIs
   - Check client ID/secret
   - Ensure HTTPS in production

3. **AI features not working**
   - Check OPENAI_API_KEY
   - Verify API key permissions
   - Check rate limits

### Debug Mode

Enable debug mode for troubleshooting:

```env
NODE_ENV=development
DEBUG=*
```

### Health Check

Check application health:

```bash
curl https://your-domain.com/api/health
```

## Performance Optimization

### Production Optimizations

1. **Enable caching**
   - Use Redis for sessions
   - Enable CDN for static assets

2. **Database optimization**
   - Use connection pooling
   - Optimize queries
   - Use read replicas

3. **Monitoring**
   - Set up error tracking
   - Monitor performance metrics
   - Use APM tools