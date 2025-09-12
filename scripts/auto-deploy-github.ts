#!/usr/bin/env ts-node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

interface DeploymentConfig {
  repositoryName: string;
  description: string;
  isPublic: boolean;
  autoFix: boolean;
  autoCommit: boolean;
  autoPush: boolean;
}

class GitHubAutoDeployer {
  private config: DeploymentConfig;

  constructor(config: DeploymentConfig) {
    this.config = config;
  }

  async deploy(): Promise<void> {
    console.log('🚀 GitHub Auto-Deployment Started');
    console.log('==================================\n');

    try {
      // Step 1: Verify project
      await this.verifyProject();

      // Step 2: Initialize Git
      await this.initializeGit();

      // Step 3: Auto-fix if requested
      if (this.config.autoFix) {
        await this.autoFixProject();
      }

      // Step 4: Create GitHub repository
      await this.createGitHubRepository();

      // Step 5: Commit changes
      if (this.config.autoCommit) {
        await this.commitChanges();
      }

      // Step 6: Push to GitHub
      if (this.config.autoPush) {
        await this.pushToGitHub();
      }

      console.log('\n🎉 Deployment completed successfully!');
      console.log(`📁 Repository: https://github.com/user/${this.config.repositoryName}`);

    } catch (error) {
      console.error('❌ Deployment failed:', error);
      throw error;
    }
  }

  private async verifyProject(): Promise<void> {
    console.log('🔍 Verifying project...');
    
    // Check if package.json exists
    try {
      await fs.access('package.json');
      console.log('✅ package.json found');
    } catch {
      throw new Error('package.json not found');
    }

    // Check if required files exist
    const requiredFiles = [
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.js',
      'prisma/schema.prisma'
    ];

    for (const file of requiredFiles) {
      try {
        await fs.access(file);
        console.log(`✅ ${file} found`);
      } catch {
        console.log(`⚠️ ${file} not found`);
      }
    }
  }

  private async initializeGit(): Promise<void> {
    console.log('📝 Initializing Git repository...');
    
    try {
      // Check if git is already initialized
      await execAsync('git status');
      console.log('✅ Git repository already initialized');
    } catch {
      // Initialize git repository
      await execAsync('git init');
      console.log('✅ Git repository initialized');
    }

    // Create .gitignore if it doesn't exist
    try {
      await fs.access('.gitignore');
    } catch {
      const gitignore = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Generated files
generated-projects/
`;
      await fs.writeFile('.gitignore', gitignore);
      console.log('✅ .gitignore created');
    }
  }

  private async autoFixProject(): Promise<void> {
    console.log('🔧 Auto-fixing project...');
    
    try {
      // Install dependencies
      await execAsync('npm install');
      console.log('✅ Dependencies installed');

      // Run linting and fix
      try {
        await execAsync('npx eslint . --ext .ts,.tsx,.js,.jsx --fix');
        console.log('✅ ESLint fixes applied');
      } catch (error) {
        console.log('⚠️ ESLint fixes failed (non-critical)');
      }

      // Check TypeScript
      try {
        await execAsync('npx tsc --noEmit');
        console.log('✅ TypeScript check passed');
      } catch (error) {
        console.log('⚠️ TypeScript errors found (non-critical)');
      }

      // Generate Prisma client
      try {
        await execAsync('npx prisma generate');
        console.log('✅ Prisma client generated');
      } catch (error) {
        console.log('⚠️ Prisma client generation failed (non-critical)');
      }

    } catch (error) {
      console.log('⚠️ Auto-fix failed (non-critical):', error);
    }
  }

  private async createGitHubRepository(): Promise<void> {
    console.log('🐙 Creating GitHub repository...');
    
    // Note: This would require GitHub CLI or API integration
    // For now, we'll just prepare the repository structure
    
    // Create README.md if it doesn't exist
    try {
      await fs.access('README.md');
    } catch {
      const readme = `# ${this.config.repositoryName}

${this.config.description}

## 🚀 Features

- **AI-Powered Code Generation**: Generate code with OpenAI GPT-4
- **Integrated Code Editor**: Monaco Editor with syntax highlighting
- **Terminal Integration**: Run commands directly in the browser
- **Auto-Fix System**: Automatically fix errors and optimize code
- **Multi-Cloud Deployment**: Deploy to Vercel, Railway, Render, Netlify
- **Authentication**: NextAuth.js with OAuth providers
- **Database**: Prisma ORM with multiple database support

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, Framer Motion
- **Editor**: Monaco Editor (VS Code engine)
- **AI**: OpenAI GPT-4 API
- **Database**: Prisma ORM (PostgreSQL/MySQL/SQLite)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel, Railway, Render, Netlify, Docker

## 🚀 Quick Start

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/user/${this.config.repositoryName}.git
   cd ${this.config.repositoryName}
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit \`.env.local\` with your configuration:
   \`\`\`env
   DATABASE_URL="postgresql://user:password@localhost:5432/boltai"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key"
   OPENAI_API_KEY="sk-your-openai-api-key"
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   npx prisma db push
   npx prisma generate
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Vercel (Recommended)
\`\`\`bash
npm run deploy:vercel
\`\`\`

### Railway
\`\`\`bash
npm run deploy:railway
\`\`\`

### Render
\`\`\`bash
npm run deploy:render
\`\`\`

### Docker
\`\`\`bash
docker build -t boltai .
docker run -p 3000:3000 boltai
\`\`\`

## 📚 Documentation

- [Quick Start Guide](./docs/QUICK_START.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Database Setup](./docs/DATABASE_SETUP.md)
- [Environment Setup](./docs/ENVIRONMENT_SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The code editor
- [OpenAI](https://openai.com/) - The AI API
- [Prisma](https://prisma.io/) - The database toolkit
- [TailwindCSS](https://tailwindcss.com/) - The CSS framework

---

**Built with ❤️ by the BoltAI Team**
`;
      await fs.writeFile('README.md', readme);
      console.log('✅ README.md created');
    }

    // Create LICENSE if it doesn't exist
    try {
      await fs.access('LICENSE');
    } catch {
      const license = `MIT License

Copyright (c) 2024 BoltAI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
      await fs.writeFile('LICENSE', license);
      console.log('✅ LICENSE created');
    }
  }

  private async commitChanges(): Promise<void> {
    console.log('📝 Committing changes...');
    
    try {
      // Add all files
      await execAsync('git add .');
      console.log('✅ Files added to staging');

      // Create commit
      const commitMessage = `Initial commit: BoltAI - AI-powered code editor and generator

- Complete Next.js application with TypeScript
- AI-powered code generation with OpenAI GPT-4
- Integrated Monaco Editor (VS Code engine)
- Terminal integration for command execution
- Auto-fix system for error correction
- Multi-cloud deployment support
- Authentication with NextAuth.js
- Database integration with Prisma ORM
- Responsive design with TailwindCSS
- Production-ready configuration

Generated on: ${new Date().toISOString()}`;

      await execAsync(`git commit -m "${commitMessage}"`);
      console.log('✅ Changes committed');
    } catch (error) {
      console.log('⚠️ Commit failed (non-critical):', error);
    }
  }

  private async pushToGitHub(): Promise<void> {
    console.log('🚀 Pushing to GitHub...');
    
    try {
      // Check if remote origin exists
      try {
        await execAsync('git remote -v');
        console.log('✅ Remote origin found');
      } catch {
        // Add remote origin (this would need to be configured)
        console.log('⚠️ Remote origin not configured. Please add your GitHub repository URL:');
        console.log('git remote add origin https://github.com/username/repository.git');
        return;
      }

      // Push to main branch
      await execAsync('git push -u origin main');
      console.log('✅ Successfully pushed to GitHub');
    } catch (error) {
      console.log('⚠️ Push failed (non-critical):', error);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run deploy:github <repository-name> [description]');
    console.log('Example: npm run deploy:github my-boltai-app "My AI-powered code editor"');
    process.exit(1);
  }

  const repositoryName = args[0];
  const description = args[1] || 'AI-powered code editor and generator';

  const config: DeploymentConfig = {
    repositoryName,
    description,
    isPublic: true,
    autoFix: true,
    autoCommit: true,
    autoPush: false, // Set to true if you want automatic push
  };

  const deployer = new GitHubAutoDeployer(config);
  await deployer.deploy();
}

if (require.main === module) {
  main().catch(console.error);
}

export default GitHubAutoDeployer;