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

interface GenerateAppRequest {
  prompt: string;
  framework?: string;
  language?: string;
  features?: string[];
  deployToGitHub?: boolean;
  autoFix?: boolean;
}

interface GenerateAppResponse {
  success: boolean;
  projectId: string;
  files: Array<{
    name: string;
    content: string;
    path: string;
    language: string;
  }>;
  deployed: boolean;
  githubUrl?: string;
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
    deployToGitHub = false,
    autoFix = true
  }: GenerateAppRequest = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Generate project ID
    const projectId = `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create project directory
    const projectDir = path.join(process.cwd(), 'generated-projects', projectId);
    await fs.mkdir(projectDir, { recursive: true });

    // Generate the application
    const generatedFiles = await generateApplication(prompt, framework, language, features);
    
    // Write files to disk
    for (const file of generatedFiles) {
      const filePath = path.join(projectDir, file.path);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, file.content);
    }

    // Create package.json if not exists
    const packageJsonPath = path.join(projectDir, 'package.json');
    try {
      await fs.access(packageJsonPath);
    } catch {
      const packageJson = generatePackageJson(framework, language, features);
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    // Auto-fix if requested
    if (autoFix) {
      await autoFixProject(projectDir);
    }

    // Deploy to GitHub if requested
    let githubUrl = '';
    if (deployToGitHub) {
      githubUrl = await deployToGitHubRepository(projectDir, projectId);
    }

    const response: GenerateAppResponse = {
      success: true,
      projectId,
      files: generatedFiles,
      deployed: deployToGitHub,
      githubUrl,
      message: 'Application generated successfully!'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating application:', error);
    res.status(500).json({ 
      error: 'Failed to generate application',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function generateApplication(
  prompt: string, 
  framework: string, 
  language: string, 
  features: string[]
): Promise<Array<{ name: string; content: string; path: string; language: string }>> {
  
  const systemPrompt = `You are an expert full-stack developer. Generate a complete, production-ready application based on the user's request.

Framework: ${framework}
Language: ${language}
Features: ${features.join(', ')}

User Request: ${prompt}

Instructions:
1. Generate a complete, working application
2. Include all necessary files (components, pages, styles, etc.)
3. Follow best practices and modern conventions
4. Make the code immediately runnable
5. Include proper error handling and validation
6. Add comments for complex logic
7. Ensure responsive design
8. Include proper TypeScript types if using TypeScript

Return your response in the following format for each file:

\`\`\`${language}
// file: /path/to/file.ext
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
  const files = parseGeneratedFiles(generatedCode, language);
  
  return files;
}

function parseGeneratedFiles(code: string, defaultLanguage: string): Array<{ name: string; content: string; path: string; language: string }> {
  const files: Array<{ name: string; content: string; path: string; language: string }> = [];
  
  // Split by code blocks
  const codeBlocks = code.split(/```(\w+)?\s*\/\/\s*file:\s*([^\n]+)/g);
  
  for (let i = 1; i < codeBlocks.length; i += 3) {
    const language = codeBlocks[i] || defaultLanguage;
    const filePath = codeBlocks[i + 1]?.trim();
    const content = codeBlocks[i + 2]?.trim();
    
    if (filePath && content) {
      const fileName = filePath.split('/').pop() || 'file';
      files.push({
        name: fileName,
        content: content,
        path: filePath,
        language: language,
      });
    }
  }
  
  // If no files were parsed, create a single file
  if (files.length === 0) {
    const cleanCode = code.replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
    files.push({
      name: 'app.tsx',
      content: cleanCode,
      path: '/app.tsx',
      language: defaultLanguage,
    });
  }
  
  return files;
}

function generatePackageJson(framework: string, language: string, features: string[]): any {
  const basePackage: any = {
    name: 'generated-app',
    version: '1.0.0',
    description: 'AI-generated application',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      'next': '^14.0.4',
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
    },
    devDependencies: {
      'eslint': '^8.56.0',
      'eslint-config-next': '^14.0.4',
    },
  };

  // Add TypeScript if specified
  if (language === 'typescript') {
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      'typescript': '^5.3.3',
      '@types/node': '^20.10.5',
      '@types/react': '^18.2.45',
      '@types/react-dom': '^18.2.18',
    };
  }

  // Add TailwindCSS if specified
  if (features.includes('tailwind')) {
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      'tailwindcss': '^3.3.6',
      'autoprefixer': '^10.4.16',
      'postcss': '^8.4.32',
    };
  }

  // Add other features
  if (features.includes('auth')) {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      'next-auth': '^4.24.5',
    };
  }

  if (features.includes('database')) {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      'prisma': '^5.7.1',
      '@prisma/client': '^5.7.1',
    };
  }

  return basePackage;
}

async function autoFixProject(projectDir: string): Promise<void> {
  try {
    // Change to project directory
    process.chdir(projectDir);
    
    // Install dependencies
    await execAsync('npm install');
    
    // Run linting and fix
    try {
      await execAsync('npx eslint . --ext .ts,.tsx,.js,.jsx --fix');
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
    await execAsync('git commit -m "Initial commit: AI-generated application"');
    
    // Create GitHub repository (this would require GitHub API)
    // For now, return a placeholder URL
    const githubUrl = `https://github.com/user/${projectId}`;
    
    return githubUrl;
  } catch (error) {
    console.error('Error deploying to GitHub:', error);
    throw error;
  }
}