# Deployment Guide

This guide covers deploying BoltAI to various cloud platforms.

## Quick Deploy

### Vercel (Recommended)

1. **Connect GitHub Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Set Environment Variables**
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   DATABASE_URL=your-database-url
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Railway

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Set Environment Variables**
   - Go to Railway dashboard
   - Add environment variables
   - Deploy automatically

### Render

1. **Connect Repository**
   - Go to [Render](https://render.com)
   - Connect your GitHub repository
   - Select "Web Service"

2. **Configure Build**
   ```
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   Environment: Node.js 18
   ```

3. **Set Environment Variables**
   - Add all required environment variables
   - Deploy

## Manual Deployment

### Using Scripts

```bash
# Check environment
npm run check-env

# Build for production
npm run build:prod

# Deploy to specific platform
npm run deploy:vercel
npm run deploy:railway
```

### Docker Deployment

```bash
# Build Docker image
docker build -t boltai .

# Run container
docker run -p 3000:3000 \
  -e NEXTAUTH_URL=https://your-domain.com \
  -e NEXTAUTH_SECRET=your-secret \
  -e DATABASE_URL=your-database-url \
  -e OPENAI_API_KEY=your-openai-key \
  boltai
```

## Environment Variables

### Required Variables

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=your-database-connection-string
OPENAI_API_KEY=your-openai-api-key
```

### Optional Variables

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Database Setup

### Vercel Postgres

1. Add Postgres database in Vercel dashboard
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `npx prisma db push`

### Supabase

1. Create Supabase project
2. Get connection string
3. Set `DATABASE_URL` environment variable

### PlanetScale

1. Create PlanetScale database
2. Get connection string
3. Set `DATABASE_URL` environment variable

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `https://your-domain.com/api/auth/callback/google`
4. Set environment variables

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Set Authorization callback URL:
   - `https://your-domain.com/api/auth/callback/github`
4. Set environment variables

## Monitoring

### Health Check

The app includes a health check endpoint at `/api/health`:

```bash
curl https://your-domain.com/api/health
```

### Logs

- **Vercel**: View logs in Vercel dashboard
- **Railway**: View logs in Railway dashboard
- **Render**: View logs in Render dashboard

## Troubleshooting

### Build Failures

1. Check Node.js version (18+ required)
2. Verify all dependencies are installed
3. Check environment variables
4. Review build logs

### Runtime Errors

1. Check environment variables
2. Verify database connection
3. Check API keys
4. Review application logs

### Performance Issues

1. Enable caching
2. Optimize database queries
3. Use CDN for static assets
4. Monitor resource usage

## Security

### Production Checklist

- [ ] Use HTTPS
- [ ] Set secure environment variables
- [ ] Enable CORS properly
- [ ] Use secure session secrets
- [ ] Enable rate limiting
- [ ] Monitor for vulnerabilities

### Environment Security

- Never commit `.env` files
- Use secure random secrets
- Rotate API keys regularly
- Monitor access logs

## Scaling

### Horizontal Scaling

- Use load balancers
- Implement session storage
- Use external databases
- Enable caching

### Vertical Scaling

- Increase memory/CPU
- Optimize database queries
- Use connection pooling
- Enable compression

## Backup

### Database Backup

- Enable automatic backups
- Test restore procedures
- Store backups securely
- Monitor backup health

### Code Backup

- Use version control
- Tag releases
- Document changes
- Keep deployment history