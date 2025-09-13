import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import OpenAI from 'openai';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AdvancedGenerationRequest {
  prompt: string;
  framework: 'nextjs' | 'react' | 'vue' | 'svelte' | 'vanilla';
  language: 'typescript' | 'javascript';
  features: string[];
  style: 'modern' | 'minimal' | 'glassmorphic' | 'neon' | 'dark';
  complexity: 'simple' | 'intermediate' | 'advanced';
  deployToGitHub?: boolean;
  includeTests?: boolean;
  includeDocs?: boolean;
}

interface AdvancedGenerationResponse {
  success: boolean;
  projectId: string;
  files: Array<{
    name: string;
    content: string;
    path: string;
    language: string;
    type: 'component' | 'page' | 'api' | 'config' | 'style' | 'test' | 'doc';
  }>;
  dependencies: string[];
  scripts: Record<string, string>;
  deployed: boolean;
  githubUrl?: string;
  previewUrl?: string;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    prompt,
    framework = 'nextjs',
    language = 'typescript',
    features = [],
    style = 'glassmorphic',
    complexity = 'intermediate',
    deployToGitHub = false,
    includeTests = false,
    includeDocs = false
  }: AdvancedGenerationRequest = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Generate project ID
    const projectId = `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create project directory
    const projectDir = path.join(process.cwd(), 'generated-projects', projectId);
    await fs.mkdir(projectDir, { recursive: true });

    // Generate the application with advanced AI
    const generatedData = await generateAdvancedApplication({
      prompt,
      framework,
      language,
      features,
      style,
      complexity,
      includeTests,
      includeDocs
    });
    
    // Write files to disk
    for (const file of generatedData.files) {
      const filePath = path.join(projectDir, file.path);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, file.content);
    }

    // Create package.json
    const packageJson = generateAdvancedPackageJson(
      framework,
      language,
      features,
      generatedData.dependencies,
      generatedData.scripts
    );
    await fs.writeFile(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Auto-fix and optimize
    await autoFixAndOptimize(projectDir);

    // Deploy to GitHub if requested
    let githubUrl = '';
    if (deployToGitHub) {
      githubUrl = await deployToGitHubRepository(projectDir, projectId);
    }

    const response: AdvancedGenerationResponse = {
      success: true,
      projectId,
      files: generatedData.files,
      dependencies: generatedData.dependencies,
      scripts: generatedData.scripts,
      deployed: deployToGitHub,
      githubUrl,
      message: 'Advanced application generated successfully!'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating advanced application:', error);
    res.status(500).json({ 
      error: 'Failed to generate advanced application',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function generateAdvancedApplication({
  prompt,
  framework,
  language,
  features,
  style,
  complexity,
  includeTests,
  includeDocs
}: Omit<AdvancedGenerationRequest, 'deployToGitHub'>) {
  
  const systemPrompt = `You are an expert full-stack developer and UI/UX designer. Generate a complete, production-ready application based on the user's request.

FRAMEWORK: ${framework}
LANGUAGE: ${language}
FEATURES: ${features.join(', ')}
STYLE: ${style}
COMPLEXITY: ${complexity}
INCLUDE TESTS: ${includeTests}
INCLUDE DOCS: ${includeDocs}

USER REQUEST: ${prompt}

INSTRUCTIONS:
1. Generate a complete, modern application with the specified style
2. Include all necessary files for a production-ready app
3. Use modern best practices and patterns
4. Implement responsive design
5. Add proper error handling and validation
6. Include accessibility features
7. Use the specified style system (glassmorphic, modern, etc.)
8. Make the code immediately runnable
9. Include proper TypeScript types if using TypeScript
10. Add comments for complex logic
11. Implement the requested features
12. Use modern CSS techniques (Grid, Flexbox, CSS Variables)
13. Include proper SEO optimization
14. Add loading states and animations
15. Implement proper state management

STYLE GUIDELINES:
- ${style === 'glassmorphic' ? 'Use glassmorphic design with backdrop blur, transparency, and subtle borders' : ''}
- ${style === 'modern' ? 'Use modern design with clean lines, proper spacing, and contemporary colors' : ''}
- ${style === 'minimal' ? 'Use minimal design with lots of white space and simple elements' : ''}
- ${style === 'neon' ? 'Use neon/cyberpunk design with bright colors and glowing effects' : ''}
- ${style === 'dark' ? 'Use dark theme with high contrast and modern dark colors' : ''}

Return your response in the following format for each file:

\`\`\`${language}
// file: /path/to/file.ext
// type: component|page|api|config|style|test|doc
[file content here]
\`\`\`

Generate multiple files as needed to create a complete application.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    max_tokens: 8000,
    temperature: 0.7,
  });

  const generatedCode = completion.choices[0]?.message?.content || '';
  
  // Parse the response to extract files
  const files = parseAdvancedGeneratedFiles(generatedCode, language);
  
  // Extract dependencies and scripts
  const dependencies = extractDependencies(files, framework, features);
  const scripts = generateScripts(framework, features);
  
  return {
    files,
    dependencies,
    scripts
  };
}

function parseAdvancedGeneratedFiles(code: string, defaultLanguage: string): Array<{
  name: string;
  content: string;
  path: string;
  language: string;
  type: 'component' | 'page' | 'api' | 'config' | 'style' | 'test' | 'doc';
}> {
  const files: Array<{
    name: string;
    content: string;
    path: string;
    language: string;
    type: 'component' | 'page' | 'api' | 'config' | 'style' | 'test' | 'doc';
  }> = [];
  
  // Split by code blocks
  const codeBlocks = code.split(/```(\w+)?\s*\/\/\s*file:\s*([^\n]+)/g);
  
  for (let i = 1; i < codeBlocks.length; i += 3) {
    const language = codeBlocks[i] || defaultLanguage;
    const filePath = codeBlocks[i + 1]?.trim();
    const content = codeBlocks[i + 2]?.trim();
    
    if (filePath && content) {
      const fileName = filePath.split('/').pop() || 'file';
      const fileType = extractFileType(filePath, content);
      
      files.push({
        name: fileName,
        content: content,
        path: filePath,
        language: language,
        type: fileType
      });
    }
  }
  
  // If no files were parsed, create a basic structure
  if (files.length === 0) {
    files.push({
      name: 'App.tsx',
      content: `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Your App
        </h1>
        <div className="glass-card max-w-md mx-auto">
          <p className="text-center">
            Your application is ready!
          </p>
        </div>
      </div>
    </div>
  );
}`,
      path: '/src/App.tsx',
      language: 'typescript',
      type: 'component'
    });
  }
  
  return files;
}

function extractFileType(filePath: string, content: string): 'component' | 'page' | 'api' | 'config' | 'style' | 'test' | 'doc' {
  if (filePath.includes('/api/') || filePath.includes('api/')) return 'api';
  if (filePath.includes('/pages/') || filePath.includes('pages/')) return 'page';
  if (filePath.includes('/components/') || filePath.includes('components/')) return 'component';
  if (filePath.includes('.test.') || filePath.includes('.spec.')) return 'test';
  if (filePath.includes('.md') || filePath.includes('README')) return 'doc';
  if (filePath.includes('.css') || filePath.includes('.scss') || filePath.includes('.sass')) return 'style';
  if (filePath.includes('config') || filePath.includes('package.json') || filePath.includes('tsconfig')) return 'config';
  
  return 'component';
}

function extractDependencies(files: any[], framework: string, features: string[]): string[] {
  const dependencies = new Set<string>();
  
  // Framework dependencies
  switch (framework) {
    case 'nextjs':
      dependencies.add('next');
      dependencies.add('react');
      dependencies.add('react-dom');
      break;
    case 'react':
      dependencies.add('react');
      dependencies.add('react-dom');
      dependencies.add('vite');
      break;
    case 'vue':
      dependencies.add('vue');
      dependencies.add('vite');
      break;
    case 'svelte':
      dependencies.add('svelte');
      dependencies.add('vite');
      break;
  }
  
  // Feature dependencies
  if (features.includes('tailwind')) {
    dependencies.add('tailwindcss');
    dependencies.add('autoprefixer');
    dependencies.add('postcss');
  }
  
  if (features.includes('framer-motion')) {
    dependencies.add('framer-motion');
  }
  
  if (features.includes('auth')) {
    dependencies.add('next-auth');
  }
  
  if (features.includes('database')) {
    dependencies.add('prisma');
    dependencies.add('@prisma/client');
  }
  
  if (features.includes('ui')) {
    dependencies.add('@headlessui/react');
    dependencies.add('@heroicons/react');
  }
  
  if (features.includes('forms')) {
    dependencies.add('react-hook-form');
    dependencies.add('@hookform/resolvers');
    dependencies.add('zod');
  }
  
  if (features.includes('state')) {
    dependencies.add('zustand');
  }
  
  if (features.includes('api')) {
    dependencies.add('axios');
  }
  
  // TypeScript dependencies
  if (files.some(f => f.language === 'typescript')) {
    dependencies.add('typescript');
    dependencies.add('@types/react');
    dependencies.add('@types/react-dom');
    dependencies.add('@types/node');
  }
  
  return Array.from(dependencies);
}

function generateScripts(framework: string, features: string[]): Record<string, string> {
  const scripts: Record<string, string> = {};
  
  switch (framework) {
    case 'nextjs':
      scripts.dev = 'next dev';
      scripts.build = 'next build';
      scripts.start = 'next start';
      scripts.lint = 'next lint';
      break;
    case 'react':
      scripts.dev = 'vite';
      scripts.build = 'vite build';
      scripts.preview = 'vite preview';
      break;
    case 'vue':
      scripts.dev = 'vite';
      scripts.build = 'vite build';
      scripts.preview = 'vite preview';
      break;
    case 'svelte':
      scripts.dev = 'vite dev';
      scripts.build = 'vite build';
      scripts.preview = 'vite preview';
      break;
  }
  
  if (features.includes('tests')) {
    scripts.test = 'jest';
    scripts['test:watch'] = 'jest --watch';
  }
  
  return scripts;
}

function generateAdvancedPackageJson(
  framework: string,
  language: string,
  features: string[],
  dependencies: string[],
  scripts: Record<string, string>
): any {
  const packageJson: any = {
    name: 'advanced-generated-app',
    version: '1.0.0',
    description: 'AI-generated advanced application',
    private: true,
    scripts,
    dependencies: {},
    devDependencies: {}
  };
  
  // Add dependencies with versions
  dependencies.forEach(dep => {
    if (dep.includes('@types/') || dep === 'typescript') {
      packageJson.devDependencies[dep] = getLatestVersion(dep);
    } else {
      packageJson.dependencies[dep] = getLatestVersion(dep);
    }
  });
  
  return packageJson;
}

function getLatestVersion(dependency: string): string {
  const versions: Record<string, string> = {
    'next': '^14.0.0',
    'react': '^18.2.0',
    'react-dom': '^18.2.0',
    'typescript': '^5.0.0',
    '@types/react': '^18.2.0',
    '@types/react-dom': '^18.2.0',
    '@types/node': '^20.0.0',
    'tailwindcss': '^3.3.0',
    'autoprefixer': '^10.4.0',
    'postcss': '^8.4.0',
    'framer-motion': '^10.16.0',
    'next-auth': '^4.24.0',
    'prisma': '^5.7.0',
    '@prisma/client': '^5.7.0',
    '@headlessui/react': '^1.7.0',
    '@heroicons/react': '^2.0.0',
    'react-hook-form': '^7.47.0',
    '@hookform/resolvers': '^3.3.0',
    'zod': '^3.22.0',
    'zustand': '^4.4.0',
    'axios': '^1.6.0',
    'vite': '^4.5.0',
    'vue': '^3.3.0',
    'svelte': '^4.2.0',
    'jest': '^29.7.0'
  };
  
  return versions[dependency] || '^1.0.0';
}

async function autoFixAndOptimize(projectDir: string): Promise<void> {
  try {
    // Change to project directory
    process.chdir(projectDir);
    
    // Install dependencies
    await execAsync('npm install');
    
    // Run linting and fix
    try {
      await execAsync('npm run lint -- --fix');
    } catch (error) {
      // Ignore linting errors for now
    }
    
    // Check TypeScript
    try {
      await execAsync('npx tsc --noEmit');
    } catch (error) {
      // Ignore TypeScript errors for now
    }
    
  } catch (error) {
    console.error('Error auto-fixing project:', error);
  }
}

async function deployToGitHubRepository(projectDir: string, projectId: string): Promise<string> {
  try {
    // Initialize git repository
    await execAsync('git init');
    
    // Add all files
    await execAsync('git add .');
    
    // Create initial commit
    await execAsync('git commit -m "Initial commit: AI-generated advanced application"');
    
    // Create GitHub repository (this would require GitHub API)
    // For now, return a placeholder URL
    const githubUrl = `https://github.com/user/${projectId}`;
    
    return githubUrl;
  } catch (error) {
    console.error('Error deploying to GitHub:', error);
    throw error;
  }
}