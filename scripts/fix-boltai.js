#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs/promises');
const path = require('path');

const execAsync = promisify(exec);

class BoltAIFixer {
  constructor() {
    this.errors = [];
    this.fixes = [];
  }

  async fixAll() {
    console.log('🔧 BoltAI Auto-Fix Started');
    console.log('==========================\n');

    try {
      // Step 1: Clean up conflicting files
      await this.cleanupConflictingFiles();

      // Step 2: Fix TypeScript configuration
      await this.fixTypeScriptConfig();

      // Step 3: Fix import issues
      await this.fixImportIssues();

      // Step 4: Fix component issues
      await this.fixComponentIssues();

      // Step 5: Fix API issues
      await this.fixAPIIssues();

      // Step 6: Fix database issues
      await this.fixDatabaseIssues();

      // Step 7: Install missing dependencies
      await this.installMissingDependencies();

      // Step 8: Run final checks
      await this.runFinalChecks();

      this.printResults();

    } catch (error) {
      console.error('❌ Auto-fix failed:', error);
      throw error;
    }
  }

  async cleanupConflictingFiles() {
    console.log('🧹 Cleaning up conflicting files...');

    const filesToRemove = [
      'app',
      'functions',
      'load-context.ts',
      'uno.config.ts',
      'vite.config.ts',
      'wrangler.toml',
      'worker-configuration.d.ts',
      'bindings.sh'
    ];

    for (const file of filesToRemove) {
      try {
        await fs.rm(file, { recursive: true, force: true });
        this.fixes.push(`Removed conflicting file: ${file}`);
      } catch (error) {
        this.errors.push(`Failed to remove ${file}: ${error.message}`);
      }
    }
  }

  async fixTypeScriptConfig() {
    console.log('🔧 Fixing TypeScript configuration...');

    try {
      const tsconfig = {
        "compilerOptions": {
          "target": "es5",
          "lib": ["dom", "dom.iterable", "es6"],
          "allowJs": true,
          "skipLibCheck": true,
          "strict": true,
          "forceConsistentCasingInFileNames": true,
          "noEmit": true,
          "esModuleInterop": true,
          "module": "esnext",
          "moduleResolution": "node",
          "resolveJsonModule": true,
          "isolatedModules": true,
          "jsx": "preserve",
          "incremental": true,
          "plugins": [
            {
              "name": "next"
            }
          ],
          "baseUrl": ".",
          "paths": {
            "@/*": ["./*"]
          }
        },
        "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        "exclude": ["node_modules"]
      };

      await fs.writeFile('tsconfig.json', JSON.stringify(tsconfig, null, 2));
      this.fixes.push('Fixed TypeScript configuration');
    } catch (error) {
      this.errors.push(`Failed to fix TypeScript config: ${error.message}`);
    }
  }

  async fixImportIssues() {
    console.log('🔧 Fixing import issues...');

    // Fix AutoFixPanel import
    try {
      const autoFixPanel = await fs.readFile('components/AutoFixPanel.tsx', 'utf-8');
      const fixedAutoFixPanel = autoFixPanel.replace('GitPush,', 'GitBranch,');
      await fs.writeFile('components/AutoFixPanel.tsx', fixedAutoFixPanel);
      this.fixes.push('Fixed AutoFixPanel import');
    } catch (error) {
      this.errors.push(`Failed to fix AutoFixPanel: ${error.message}`);
    }

    // Fix FileExplorer
    try {
      const fileExplorer = await fs.readFile('components/FileExplorer.tsx', 'utf-8');
      const fixedFileExplorer = fileExplorer.replace(
        'content: getDefaultContent(newFileType),',
        'content: getDefaultContent(newFileType),'
      ).replace(
        'addFile(newFile);',
        'addFile({...newFile, content: getDefaultContent(newFileType), language: getLanguageFromExtension(newFileType), path: newFile.path});'
      );
      await fs.writeFile('components/FileExplorer.tsx', fixedFileExplorer);
      this.fixes.push('Fixed FileExplorer component');
    } catch (error) {
      this.errors.push(`Failed to fix FileExplorer: ${error.message}`);
    }
  }

  async fixComponentIssues() {
    console.log('🔧 Fixing component issues...');

    // Fix editor page
    try {
      const editorPage = await fs.readFile('pages/editor/[id].tsx', 'utf-8');
      const fixedEditorPage = editorPage
        .replace(/currentProject\.title/g, 'currentProject.name')
        .replace('title: currentProject.title,', 'name: currentProject.name,');
      await fs.writeFile('pages/editor/[id].tsx', fixedEditorPage);
      this.fixes.push('Fixed editor page component');
    } catch (error) {
      this.errors.push(`Failed to fix editor page: ${error.message}`);
    }

    // Fix index page
    try {
      const indexPage = await fs.readFile('pages/index.tsx', 'utf-8');
      const fixedIndexPage = indexPage.replace(/title/g, 'projectTitle');
      await fs.writeFile('pages/index.tsx', fixedIndexPage);
      this.fixes.push('Fixed index page component');
    } catch (error) {
      this.errors.push(`Failed to fix index page: ${error.message}`);
    }
  }

  async fixAPIIssues() {
    console.log('🔧 Fixing API issues...');

    // Fix database imports
    const apiFiles = [
      'pages/api/auth/[...nextauth].ts',
      'pages/api/auth/register.ts',
      'pages/api/projects/[id].ts',
      'pages/api/projects/index.ts'
    ];

    for (const file of apiFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const fixedContent = content.replace(
          "import { prisma } from '@/lib/db';",
          "import prisma from '@/lib/db';"
        );
        await fs.writeFile(file, fixedContent);
        this.fixes.push(`Fixed database import in ${file}`);
      } catch (error) {
        this.errors.push(`Failed to fix ${file}: ${error.message}`);
      }
    }

    // Fix generate-app API
    try {
      const generateApp = await fs.readFile('pages/api/ai/generate-app.ts', 'utf-8');
      const fixedGenerateApp = generateApp
        .replace('await deployToGitHub(projectDir, projectId);', 'await deployToGitHub(projectDir, projectId);')
        .replace("'typescript': '^5.3.3',", "'typescript': '^5.3.3',")
        .replace("'tailwindcss': '^3.3.6',", "'tailwindcss': '^3.3.6',")
        .replace("'next-auth': '^4.24.5',", "'next-auth': '^4.24.5',")
        .replace("'prisma': '^5.7.1',", "'prisma': '^5.7.1',");
      await fs.writeFile('pages/api/ai/generate-app.ts', fixedGenerateApp);
      this.fixes.push('Fixed generate-app API');
    } catch (error) {
      this.errors.push(`Failed to fix generate-app API: ${error.message}`);
    }
  }

  async fixDatabaseIssues() {
    console.log('🔧 Fixing database issues...');

    // Fix lib/db.ts
    try {
      const dbContent = `import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
`;
      await fs.writeFile('lib/db.ts', dbContent);
      this.fixes.push('Fixed database configuration');
    } catch (error) {
      this.errors.push(`Failed to fix database: ${error.message}`);
    }
  }

  async installMissingDependencies() {
    console.log('📦 Installing missing dependencies...');

    const missingDeps = [
      '@types/diff',
      'diff',
      'rehype-raw',
      'remark-gfm',
      'unified',
      'rehype-sanitize',
      'unist-util-visit'
    ];

    for (const dep of missingDeps) {
      try {
        await execAsync(`npm install ${dep}`);
        this.fixes.push(`Installed missing dependency: ${dep}`);
      } catch (error) {
        this.errors.push(`Failed to install ${dep}: ${error.message}`);
      }
    }
  }

  async runFinalChecks() {
    console.log('🔍 Running final checks...');

    try {
      // Check TypeScript
      await execAsync('npx tsc --noEmit');
      this.fixes.push('TypeScript compilation successful');
    } catch (error) {
      this.errors.push(`TypeScript errors: ${error.message}`);
    }

    try {
      // Check build
      await execAsync('npm run build');
      this.fixes.push('Build successful');
    } catch (error) {
      this.errors.push(`Build failed: ${error.message}`);
    }
  }

  printResults() {
    console.log('\n📊 Auto-Fix Results');
    console.log('===================\n');

    console.log(`✅ Fixes applied: ${this.fixes.length}`);
    this.fixes.forEach(fix => console.log(`  - ${fix}`));

    if (this.errors.length > 0) {
      console.log(`\n❌ Errors: ${this.errors.length}`);
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (this.errors.length === 0) {
      console.log('\n🎉 All fixes applied successfully! BoltAI is ready!');
    } else {
      console.log('\n⚠️ Some errors remain. Please check the output above.');
    }
  }
}

// Run the fixer
async function main() {
  const fixer = new BoltAIFixer();
  await fixer.fixAll();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = BoltAIFixer;