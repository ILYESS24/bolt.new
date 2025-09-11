# Database Setup Guide

This guide will help you set up a database for BoltAI on various cloud platforms.

## Supported Databases

- **PostgreSQL** (Recommended for production)
- **MySQL** (Alternative)
- **SQLite** (Development only)

## Cloud Database Providers

### 1. Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select existing
3. Go to Storage tab
4. Create a Postgres database
5. Copy the connection string to `DATABASE_URL`

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

### 2. Supabase

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

```env
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

### 3. PlanetScale

1. Go to [PlanetScale](https://planetscale.com)
2. Create a new database
3. Get the connection string

```env
DATABASE_URL="mysql://username:password@host:port/database"
```

### 4. Railway

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the connection string

### 5. Neon

1. Go to [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

## Local Development

For local development, you can use SQLite:

```env
DATABASE_URL="file:./dev.db"
```

## Database Migration

After setting up your database, run the following commands:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

## Environment Variables

Make sure to set these environment variables:

```env
DATABASE_URL="your-database-connection-string"
DIRECT_URL="your-direct-connection-string" # For some providers
```

## Troubleshooting

### Connection Issues

1. Check your connection string format
2. Ensure your database is accessible from your deployment platform
3. Check firewall settings
4. Verify credentials

### Migration Issues

1. Make sure Prisma client is generated: `npm run db:generate`
2. Check database permissions
3. Ensure schema is up to date

### Performance

1. Use connection pooling for production
2. Enable SSL connections
3. Monitor query performance
4. Use read replicas for heavy read workloads