#!/usr/bin/env ts-node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

interface VerificationResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  details?: string;
}

class BoltAIVerifier {
  private results: VerificationResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🔍 BoltAI Verification Suite');
    console.log('============================\n');

    // Core functionality tests
    await this.testProjectStructure();
    await this.testDependencies();
    await this.testTypeScript();
    await this.testESLint();
    await this.testBuild();
    await this.testDatabase();
    await this.testAuthentication();
    await this.testAIComponents();
    await this.testEditorComponents();
    await this.testTerminalComponent();
    await this.testAutoFixSystem();
    await this.testAppGenerator();
    await this.testDeploymentConfigs();

    // Print results
    this.printResults();
  }

  private async testProjectStructure(): Promise<void> {
    console.log('📁 Testing project structure...');
    
    const requiredFiles = [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.js',
      'prisma/schema.prisma',
      'pages/editor/[id].tsx',
      'components/CodeEditor.tsx',
      'components/AIPanel.tsx',
      'components/Terminal.tsx',
      'components/AutoFixPanel.tsx',
      'components/AppGenerator.tsx',
      'pages/api/ai/generate.ts',
      'pages/api/ai/auto-fix.ts',
      'pages/api/ai/generate-app.ts',
    ];

    for (const file of requiredFiles) {
      try {
        await fs.access(file);
        this.addResult('PASS', `File exists: ${file}`);
      } catch {
        this.addResult('FAIL', `Missing file: ${file}`);
      }
    }
  }

  private async testDependencies(): Promise<void> {
    console.log('📦 Testing dependencies...');
    
    try {
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'));
      
      const requiredDeps = [
        'next', 'react', 'react-dom', 'typescript',
        '@monaco-editor/react', 'monaco-editor',
        'openai', 'ai', 'zustand', 'react-hot-toast',
        'framer-motion', 'react-split', 'next-auth',
        'prisma', '@prisma/client'
      ];

      for (const dep of requiredDeps) {
        if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
          this.addResult('PASS', `Dependency found: ${dep}`);
        } else {
          this.addResult('FAIL', `Missing dependency: ${dep}`);
        }
      }
    } catch (error) {
      this.addResult('FAIL', 'Failed to read package.json', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testTypeScript(): Promise<void> {
    console.log('🔧 Testing TypeScript...');
    
    try {
      const { stdout, stderr } = await execAsync('npx tsc --noEmit');
      if (stderr) {
        this.addResult('FAIL', 'TypeScript errors found', stderr);
      } else {
        this.addResult('PASS', 'TypeScript compilation successful');
      }
    } catch (error: any) {
      if (error.stdout) {
        this.addResult('FAIL', 'TypeScript errors found', error.stdout);
      } else {
        this.addResult('FAIL', 'TypeScript test failed', error.message);
      }
    }
  }

  private async testESLint(): Promise<void> {
    console.log('🔍 Testing ESLint...');
    
    try {
      const { stdout } = await execAsync('npx eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0');
      this.addResult('PASS', 'ESLint passed with no errors');
    } catch (error: any) {
      if (error.stdout) {
        this.addResult('FAIL', 'ESLint errors found', error.stdout);
      } else {
        this.addResult('FAIL', 'ESLint test failed', error.message);
      }
    }
  }

  private async testBuild(): Promise<void> {
    console.log('🏗️ Testing build...');
    
    try {
      const { stdout } = await execAsync('npm run build');
      this.addResult('PASS', 'Build successful');
    } catch (error: any) {
      this.addResult('FAIL', 'Build failed', error.stdout || error.message);
    }
  }

  private async testDatabase(): Promise<void> {
    console.log('🗄️ Testing database configuration...');
    
    try {
      const schema = await fs.readFile('prisma/schema.prisma', 'utf-8');
      
      if (schema.includes('model Project')) {
        this.addResult('PASS', 'Project model found in schema');
      } else {
        this.addResult('FAIL', 'Project model missing from schema');
      }

      if (schema.includes('model User')) {
        this.addResult('PASS', 'User model found in schema');
      } else {
        this.addResult('FAIL', 'User model missing from schema');
      }

      if (schema.includes('model ProjectFile')) {
        this.addResult('PASS', 'ProjectFile model found in schema');
      } else {
        this.addResult('FAIL', 'ProjectFile model missing from schema');
      }
    } catch (error) {
      this.addResult('FAIL', 'Failed to read Prisma schema', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testAuthentication(): Promise<void> {
    console.log('🔐 Testing authentication...');
    
    try {
      const authFile = await fs.readFile('pages/api/auth/[...nextauth].ts', 'utf-8');
      
      if (authFile.includes('NextAuth')) {
        this.addResult('PASS', 'NextAuth configuration found');
      } else {
        this.addResult('FAIL', 'NextAuth configuration missing');
      }

      if (authFile.includes('GoogleProvider') || authFile.includes('GitHubProvider')) {
        this.addResult('PASS', 'OAuth providers configured');
      } else {
        this.addResult('FAIL', 'OAuth providers not configured');
      }
    } catch (error) {
      this.addResult('FAIL', 'Failed to read auth configuration', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testAIComponents(): Promise<void> {
    console.log('🤖 Testing AI components...');
    
    try {
      const aiGenerate = await fs.readFile('pages/api/ai/generate.ts', 'utf-8');
      
      if (aiGenerate.includes('OpenAI')) {
        this.addResult('PASS', 'OpenAI integration found');
      } else {
        this.addResult('FAIL', 'OpenAI integration missing');
      }

      if (aiGenerate.includes('gpt-4')) {
        this.addResult('PASS', 'GPT-4 model configured');
      } else {
        this.addResult('FAIL', 'GPT-4 model not configured');
      }
    } catch (error) {
      this.addResult('FAIL', 'Failed to read AI generate API', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testEditorComponents(): Promise<void> {
    console.log('📝 Testing editor components...');
    
    try {
      const codeEditor = await fs.readFile('components/CodeEditor.tsx', 'utf-8');
      
      if (codeEditor.includes('@monaco-editor/react')) {
        this.addResult('PASS', 'Monaco Editor integration found');
      } else {
        this.addResult('FAIL', 'Monaco Editor integration missing');
      }

      if (codeEditor.includes('getLanguageFromExtension')) {
        this.addResult('PASS', 'Language detection function found');
      } else {
        this.addResult('FAIL', 'Language detection function missing');
      }
    } catch (error) {
      this.addResult('FAIL', 'Failed to read CodeEditor component', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testTerminalComponent(): Promise<void> {
    console.log('💻 Testing terminal component...');
    
    try {
      const terminal = await fs.readFile('components/Terminal.tsx', 'utf-8');
      
      if (terminal.includes('Terminal')) {
        this.addResult('PASS', 'Terminal component found');
      } else {
        this.addResult('FAIL', 'Terminal component missing');
      }
    } catch (error) {
      this.addResult('FAIL', 'Failed to read Terminal component', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testAutoFixSystem(): Promise<void> {
    console.log('🔧 Testing auto-fix system...');
    
    try {
      const autoFix = await fs.readFile('pages/api/ai/auto-fix.ts', 'utf-8');
      
      if (autoFix.includes('checkForErrors')) {
        this.addResult('PASS', 'Error checking function found');
      } else {
        this.addResult('FAIL', 'Error checking function missing');
      }

      if (autoFix.includes('autoFixErrors')) {
        this.addResult('PASS', 'Auto-fix function found');
      } else {
        this.addResult('FAIL', 'Auto-fix function missing');
      }

      if (autoFix.includes('autoCommitChanges')) {
        this.addResult('PASS', 'Auto-commit function found');
      } else {
        this.addResult('FAIL', 'Auto-commit function missing');
      }

      if (autoFix.includes('autoPushToGitHub')) {
        this.addResult('PASS', 'Auto-push function found');
      } else {
        this.addResult('FAIL', 'Auto-push function missing');
      }
    } catch (error) {
      this.addResult('FAIL', 'Failed to read auto-fix API', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testAppGenerator(): Promise<void> {
    console.log('🚀 Testing app generator...');
    
    try {
      const appGenerator = await fs.readFile('pages/api/ai/generate-app.ts', 'utf-8');
      
      if (appGenerator.includes('generateApplication')) {
        this.addResult('PASS', 'App generation function found');
      } else {
        this.addResult('FAIL', 'App generation function missing');
      }

      if (appGenerator.includes('deployToGitHub')) {
        this.addResult('PASS', 'GitHub deployment function found');
      } else {
        this.addResult('FAIL', 'GitHub deployment function missing');
      }
    } catch (error) {
      this.addResult('FAIL', 'Failed to read app generator API', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async testDeploymentConfigs(): Promise<void> {
    console.log('🌐 Testing deployment configurations...');
    
    const deploymentFiles = [
      'vercel.json',
      'railway.json',
      'render.yaml',
      'netlify.toml',
      'Dockerfile',
      'docker-compose.yml'
    ];

    for (const file of deploymentFiles) {
      try {
        await fs.access(file);
        this.addResult('PASS', `Deployment config found: ${file}`);
      } catch {
        this.addResult('FAIL', `Missing deployment config: ${file}`);
      }
    }
  }

  private addResult(status: 'PASS' | 'FAIL' | 'SKIP', message: string, details?: string): void {
    this.results.push({
      test: message,
      status,
      message: status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️',
      details
    });
  }

  private printResults(): void {
    console.log('\n📊 Verification Results');
    console.log('======================\n');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️ Skipped: ${skipped}`);
    console.log(`📊 Total: ${this.results.length}\n`);

    if (failed > 0) {
      console.log('❌ Failed Tests:');
      this.results.filter(r => r.status === 'FAIL').forEach(result => {
        console.log(`  - ${result.test}`);
        if (result.details) {
          console.log(`    ${result.details}`);
        }
      });
      console.log('');
    }

    if (passed === this.results.length) {
      console.log('🎉 All tests passed! BoltAI is ready for production!');
    } else {
      console.log('⚠️ Some tests failed. Please fix the issues before deployment.');
    }
  }
}

// Run the verification
async function main() {
  const verifier = new BoltAIVerifier();
  await verifier.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

export default BoltAIVerifier;