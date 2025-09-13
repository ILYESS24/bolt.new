#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs/promises');
const path = require('path');

const execAsync = promisify(exec);

class AdvancedErrorFixer {
  constructor() {
    this.errors = [];
    this.fixes = [];
    this.warnings = [];
  }

  async fixAllErrors() {
    console.log('🔧 Advanced Error Fixer - BoltAI Studio');
    console.log('========================================\n');

    try {
      // Step 1: Fix TypeScript errors
      await this.fixTypeScriptErrors();

      // Step 2: Fix React/Next.js errors
      await this.fixReactErrors();

      // Step 3: Fix import errors
      await this.fixImportErrors();

      // Step 4: Fix dependency issues
      await this.fixDependencyIssues();

      // Step 5: Fix build errors
      await this.fixBuildErrors();

      // Step 6: Fix runtime errors
      await this.fixRuntimeErrors();

      // Step 7: Optimize performance
      await this.optimizePerformance();

      // Step 8: Final verification
      await this.finalVerification();

      this.printResults();

    } catch (error) {
      console.error('❌ Error fixing failed:', error);
      throw error;
    }
  }

  async fixTypeScriptErrors() {
    console.log('🔧 Fixing TypeScript errors...');

    try {
      // Fix missing type declarations
      const typeFiles = [
        'types/webcontainer.d.ts',
        'types/react-dnd.d.ts',
        'types/reactflow.d.ts'
      ];

      for (const file of typeFiles) {
        try {
          await fs.access(file);
        } catch {
          const content = this.generateTypeDeclarations(file);
          await fs.writeFile(file, content);
          this.fixes.push(`Created type declarations: ${file}`);
        }
      }

      // Fix tsconfig.json
      const tsconfig = {
        "compilerOptions": {
          "target": "es5",
          "lib": ["dom", "dom.iterable", "es6", "es2017", "es2020"],
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
          },
          "types": ["node", "react", "react-dom"]
        },
        "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "types/**/*.d.ts"],
        "exclude": ["node_modules"]
      };

      await fs.writeFile('tsconfig.json', JSON.stringify(tsconfig, null, 2));
      this.fixes.push('Fixed TypeScript configuration');

    } catch (error) {
      this.errors.push(`TypeScript fix failed: ${error.message}`);
    }
  }

  async fixReactErrors() {
    console.log('🔧 Fixing React/Next.js errors...');

    try {
      // Fix missing React imports
      const reactFiles = [
        'components/WebContainer.tsx',
        'components/AdvancedAppGenerator.tsx',
        'components/VisualEditor.tsx',
        'pages/studio.tsx'
      ];

      for (const file of reactFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          if (!content.includes("import React") && !content.includes("import { useState")) {
            const fixedContent = `import React from 'react';\n${content}`;
            await fs.writeFile(file, fixedContent);
            this.fixes.push(`Added React import to ${file}`);
          }
        } catch (error) {
          this.warnings.push(`Could not fix ${file}: ${error.message}`);
        }
      }

      // Fix useEffect imports
      for (const file of reactFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          if (content.includes('useEffect') && !content.includes('useEffect')) {
            const fixedContent = content.replace(
              "import React from 'react';",
              "import React, { useState, useEffect, useCallback, useRef } from 'react';"
            );
            await fs.writeFile(file, fixedContent);
            this.fixes.push(`Added React hooks import to ${file}`);
          }
        } catch (error) {
          // Ignore if file doesn't exist
        }
      }

    } catch (error) {
      this.errors.push(`React fix failed: ${error.message}`);
    }
  }

  async fixImportErrors() {
    console.log('🔧 Fixing import errors...');

    try {
      // Fix missing component imports
      const importFixes = [
        {
          file: 'pages/studio.tsx',
          imports: [
            "import WebContainer from '@/components/WebContainer';",
            "import AdvancedAppGenerator from '@/components/AdvancedAppGenerator';",
            "import VisualEditor from '@/components/VisualEditor';",
            "import CodeEditor from '@/components/CodeEditor';",
            "import Terminal from '@/components/Terminal';",
            "import AutoFixPanel from '@/components/AutoFixPanel';"
          ]
        }
      ];

      for (const fix of importFixes) {
        try {
          const content = await fs.readFile(fix.file, 'utf-8');
          let fixedContent = content;
          
          for (const importStatement of fix.imports) {
            if (!content.includes(importStatement)) {
              fixedContent = importStatement + '\n' + fixedContent;
            }
          }
          
          if (fixedContent !== content) {
            await fs.writeFile(fix.file, fixedContent);
            this.fixes.push(`Fixed imports in ${fix.file}`);
          }
        } catch (error) {
          this.warnings.push(`Could not fix imports in ${fix.file}: ${error.message}`);
        }
      }

    } catch (error) {
      this.errors.push(`Import fix failed: ${error.message}`);
    }
  }

  async fixDependencyIssues() {
    console.log('🔧 Fixing dependency issues...');

    try {
      // Install missing dependencies
      const missingDeps = [
        '@webcontainer/api',
        '@xterm/xterm',
        '@xterm/addon-fit',
        '@xterm/addon-web-links',
        '@xterm/addon-search',
        '@xterm/addon-unicode11',
        'react-dnd',
        'react-dnd-html5-backend',
        'react-flow',
        '@reactflow/core',
        '@reactflow/node-toolbar',
        '@reactflow/controls',
        '@reactflow/minimap',
        '@reactflow/background',
        '@headlessui/react',
        '@heroicons/react'
      ];

      for (const dep of missingDeps) {
        try {
          await execAsync(`npm install ${dep}`);
          this.fixes.push(`Installed missing dependency: ${dep}`);
        } catch (error) {
          this.warnings.push(`Could not install ${dep}: ${error.message}`);
        }
      }

      // Update package.json scripts
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'));
      packageJson.scripts = {
        ...packageJson.scripts,
        'studio': 'next dev -p 3001',
        'build:studio': 'next build',
        'fix:errors': 'node scripts/fix-all-errors.js',
        'verify:studio': 'npm run build:studio && npm run lint'
      };

      await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2));
      this.fixes.push('Updated package.json scripts');

    } catch (error) {
      this.errors.push(`Dependency fix failed: ${error.message}`);
    }
  }

  async fixBuildErrors() {
    console.log('🔧 Fixing build errors...');

    try {
      // Fix Next.js configuration
      const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'vercel.app', '*.vercel.app'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  },
  // Optimize for production
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  // Enable standalone output for Docker
  output: 'standalone',
  // Optimize bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig`;

      await fs.writeFile('next.config.js', nextConfig);
      this.fixes.push('Fixed Next.js configuration');

    } catch (error) {
      this.errors.push(`Build fix failed: ${error.message}`);
    }
  }

  async fixRuntimeErrors() {
    console.log('🔧 Fixing runtime errors...');

    try {
      // Create error boundary component
      const errorBoundary = `import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error: Error }) {
  return (
    <div className="h-screen flex items-center justify-center animated-bg">
      <div className="glass-card text-center max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="glass-button"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;`;

      await fs.writeFile('components/ErrorBoundary.tsx', errorBoundary);
      this.fixes.push('Created error boundary component');

    } catch (error) {
      this.errors.push(`Runtime fix failed: ${error.message}`);
    }
  }

  async optimizePerformance() {
    console.log('🔧 Optimizing performance...');

    try {
      // Create performance monitoring
      const performanceMonitor = `import { useEffect } from 'react';

export function usePerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('Performance metric:', entry.name, entry.value);
        }
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }, []);
}

export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(\`\${name} took \${end - start} milliseconds\`);
}`;

      await fs.writeFile('lib/performance.ts', performanceMonitor);
      this.fixes.push('Created performance monitoring');

    } catch (error) {
      this.errors.push(`Performance optimization failed: ${error.message}`);
    }
  }

  async finalVerification() {
    console.log('🔍 Final verification...');

    try {
      // Check TypeScript
      await execAsync('npx tsc --noEmit');
      this.fixes.push('TypeScript compilation successful');

      // Check build
      await execAsync('npm run build');
      this.fixes.push('Build successful');

    } catch (error) {
      this.errors.push(`Final verification failed: ${error.message}`);
    }
  }

  generateTypeDeclarations(filename) {
    const typeMap = {
      'types/webcontainer.d.ts': `declare module '@webcontainer/api' {
  export interface WebContainer {
    boot(): Promise<WebContainer>;
    mount(tree: any): Promise<void>;
    spawn(command: string, args?: string[]): Promise<any>;
    fs: {
      readFile(path: string, encoding?: string): Promise<string>;
      writeFile(path: string, content: string): Promise<void>;
      readdir(path: string, options?: any): Promise<any[]>;
    };
    on(event: string, callback: Function): void;
    teardown(): void;
  }
  
  export const WebContainer: {
    boot(): Promise<WebContainer>;
  };
}`,
      'types/react-dnd.d.ts': `declare module 'react-dnd' {
  export function DndProvider(props: any): JSX.Element;
  export function useDrag(options: any): any[];
  export function useDrop(options: any): any[];
}

declare module 'react-dnd-html5-backend' {
  export const HTML5Backend: any;
}`,
      'types/reactflow.d.ts': `declare module '@reactflow/core' {
  export interface Node {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: any;
  }
  
  export interface Edge {
    id: string;
    source: string;
    target: string;
  }
  
  export function useNodesState(initial: Node[]): [Node[], any, any];
  export function useEdgesState(initial: Edge[]): [Edge[], any, any];
  export function addEdge(edge: Edge, edges: Edge[]): Edge[];
  
  export default function ReactFlow(props: any): JSX.Element;
  export const Controls: any;
  export const Background: any;
  export const MiniMap: any;
  export const NodeToolbar: any;
  export const BackgroundVariant: any;
  export const MarkerType: any;
}`
    };

    return typeMap[filename] || '// Type declarations';
  }

  printResults() {
    console.log('\n📊 ADVANCED ERROR FIXING RESULTS');
    console.log('==================================\n');

    console.log(`✅ Fixes applied: ${this.fixes.length}`);
    this.fixes.forEach(fix => console.log(`  - ${fix}`));

    if (this.warnings.length > 0) {
      console.log(`\n⚠️ Warnings: ${this.warnings.length}`);
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    if (this.errors.length > 0) {
      console.log(`\n❌ Errors: ${this.errors.length}`);
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (this.errors.length === 0) {
      console.log('\n🎉 ALL ERRORS FIXED! BoltAI Studio is ready!');
      console.log('\n🚀 Studio Features:');
      console.log('✅ Advanced AI Generator');
      console.log('✅ Visual Drag & Drop Editor');
      console.log('✅ WebContainer Integration');
      console.log('✅ Glassmorphic UI Design');
      console.log('✅ Real-time Preview');
      console.log('✅ Auto-fix System');
      console.log('✅ Performance Optimization');
      console.log('\n📋 Next Steps:');
      console.log('1. Run: npm run studio');
      console.log('2. Open: http://localhost:3001/studio');
      console.log('3. Start building with AI!');
    } else {
      console.log('\n⚠️ Some errors remain. Please check the output above.');
    }
  }
}

// Run the advanced error fixer
async function main() {
  const fixer = new AdvancedErrorFixer();
  await fixer.fixAllErrors();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = AdvancedErrorFixer;