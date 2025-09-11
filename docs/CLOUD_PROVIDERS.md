# Cloud Providers Guide

This guide covers deploying BoltAI to various cloud providers.

## 🚀 Vercel (Recommended)

### Why Vercel?

- **Zero configuration** - Works out of the box
- **Automatic deployments** - Deploy on every push
- **Edge functions** - Fast API responses
- **Built-in analytics** - Monitor performance
- **Free tier** - Perfect for small projects

### Deployment Steps

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Environment Variables**
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   DATABASE_URL=your-database-url
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Database Setup**
   - Add Vercel Postgres database
   - Copy connection string to DATABASE_URL
   - Run `npx prisma db push`

### Pricing

- **Free**: 100GB bandwidth, 100 serverless functions
- **Pro**: $20/month, unlimited bandwidth
- **Enterprise**: Custom pricing

## 🚂 Railway

### Why Railway?

- **Simple deployment** - One-click deploy
- **Built-in databases** - PostgreSQL included
- **Environment management** - Easy secrets handling
- **GitHub integration** - Auto-deploy on push

### Deployment Steps

1. **Install CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add Database**
   ```bash
   railway add postgresql
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set NEXTAUTH_URL=https://your-app.railway.app
   railway variables set NEXTAUTH_SECRET=your-secret-key
   railway variables set OPENAI_API_KEY=your-openai-api-key
   ```

### Pricing

- **Free**: $5 credit monthly
- **Pro**: $5/month per service
- **Team**: $20/month per member

## 🎨 Render

### Why Render?

- **Full-stack hosting** - Frontend and backend
- **Automatic SSL** - HTTPS included
- **Zero-downtime deployments** - Blue-green deployments
- **Built-in monitoring** - Performance insights

### Deployment Steps

1. **Connect Repository**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository

2. **Configure Service**
   ```
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   Environment: Node.js 18
   ```

3. **Add Database**
   - Create PostgreSQL database
   - Copy connection string

4. **Environment Variables**
   ```
   NEXTAUTH_URL=https://your-app.onrender.com
   NEXTAUTH_SECRET=your-secret-key
   DATABASE_URL=your-database-url
   OPENAI_API_KEY=your-openai-api-key
   ```

### Pricing

- **Free**: 750 hours/month
- **Starter**: $7/month
- **Standard**: $25/month

## 🌐 Netlify

### Why Netlify?

- **JAMstack optimized** - Perfect for static sites
- **Edge functions** - Serverless functions
- **Form handling** - Built-in form processing
- **Split testing** - A/B testing included

### Deployment Steps

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository

2. **Configure Build**
   ```
   Build Command: npm run build
   Publish Directory: .next
   ```

3. **Add Functions**
   - Create `netlify/functions` directory
   - Move API routes to functions

4. **Environment Variables**
   ```
   NEXTAUTH_URL=https://your-app.netlify.app
   NEXTAUTH_SECRET=your-secret-key
   DATABASE_URL=your-database-url
   OPENAI_API_KEY=your-openai-api-key
   ```

### Pricing

- **Free**: 100GB bandwidth, 300 build minutes
- **Pro**: $19/month, 1TB bandwidth
- **Business**: $99/month, 1.5TB bandwidth

## 🐳 Docker

### Why Docker?

- **Portable** - Run anywhere
- **Consistent** - Same environment everywhere
- **Scalable** - Easy horizontal scaling
- **Isolated** - No dependency conflicts

### Deployment Steps

1. **Build Image**
   ```bash
   docker build -t boltai .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXTAUTH_URL=https://your-domain.com \
     -e NEXTAUTH_SECRET=your-secret \
     -e DATABASE_URL=your-database-url \
     -e OPENAI_API_KEY=your-openai-key \
     boltai
   ```

3. **Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Cloud Platforms

- **AWS ECS** - Container orchestration
- **Google Cloud Run** - Serverless containers
- **Azure Container Instances** - Managed containers
- **DigitalOcean App Platform** - Simple container hosting

## 🔧 Custom Server

### Why Custom Server?

- **Full control** - Complete customization
- **Cost effective** - For high-traffic applications
- **Performance** - Optimized for your needs
- **Compliance** - Meet specific requirements

### Deployment Steps

1. **Prepare Server**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nodejs npm nginx
   ```

2. **Deploy Application**
   ```bash
   git clone https://github.com/your-username/boltai.git
   cd boltai
   npm install
   npm run build
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Process Manager**
   ```bash
   npm install -g pm2
   pm2 start npm --name "boltai" -- start
   pm2 startup
   pm2 save
   ```

## 📊 Comparison

| Provider | Free Tier | Ease of Use | Performance | Cost |
|----------|-----------|-------------|-------------|------|
| Vercel | ✅ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $20/month |
| Railway | ✅ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $5/month |
| Render | ✅ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $7/month |
| Netlify | ✅ | ⭐⭐⭐⭐ | ⭐⭐⭐ | $19/month |
| Docker | ❌ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Variable |

## 🎯 Recommendations

### For Beginners
- **Vercel** - Easiest to get started
- **Railway** - Great for full-stack apps

### For Production
- **Vercel** - Best performance and features
- **Custom Server** - Full control and cost-effective

### For Enterprise
- **AWS/GCP/Azure** - Enterprise features
- **Custom Server** - Compliance and security

## 🚀 Quick Deploy Commands

```bash
# Vercel
npm run deploy:vercel

# Railway
npm run deploy railway

# Render
npm run deploy render

# Docker
docker build -t boltai . && docker run -p 3000:3000 boltai
```

Choose the platform that best fits your needs and budget!