export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
    // For production, use a cloud database
    production: {
      // Vercel Postgres
      vercel: process.env.POSTGRES_URL,
      // PlanetScale
      planetscale: process.env.DATABASE_URL,
      // Supabase
      supabase: process.env.SUPABASE_URL,
    }
  },

  // Authentication
  auth: {
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
    providers: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      },
    }
  },

  // AI
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
    }
  },

  // App
  app: {
    name: 'BoltAI',
    description: 'AI-Powered Code Generator',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    environment: process.env.NODE_ENV || 'development',
  },

  // Features
  features: {
    ai: !!process.env.OPENAI_API_KEY,
    oauth: {
      google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      github: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    }
  }
};

export default config;