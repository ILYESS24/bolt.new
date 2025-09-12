import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import OpenAI from 'openai';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AutoFixRequest {
  projectId: string;
  prompt?: string;
  autoFix: boolean;
  autoCommit: boolean;
  autoPush: boolean;
}

interface AutoFixResponse {
  success: boolean;
  errors: string[];
  fixes: string[];
  commits: string[];
  pushed: boolean;
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

  const { projectId, prompt, autoFix, autoCommit, autoPush }: AutoFixRequest = req.body;

  try {
    const response: AutoFixResponse = {
      success: false,
      errors: [],
      fixes: [],
      commits: [],
      pushed: false,
      message: '',
    };

    // Step 1: Check for errors
    console.log('🔍 Checking for errors...');
    const errors = await checkForErrors();
    response.errors = errors;

    if (errors.length === 0) {
      response.success = true;
      response.message = 'No errors found! Project is clean.';
      return res.status(200).json(response);
    }

    // Step 2: Auto-fix errors if requested
    if (autoFix) {
      console.log('🔧 Auto-fixing errors...');
      const fixes = await autoFixErrors(errors, prompt);
      response.fixes = fixes;
    }

    // Step 3: Auto-commit if requested
    if (autoCommit) {
      console.log('📝 Auto-committing changes...');
      const commits = await autoCommitChanges();
      response.commits = commits;
    }

    // Step 4: Auto-push if requested
    if (autoPush) {
      console.log('🚀 Auto-pushing to GitHub...');
      const pushed = await autoPushToGitHub();
      response.pushed = pushed;
    }

    response.success = true;
    response.message = 'Auto-fix process completed successfully!';

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in auto-fix process:', error);
    res.status(500).json({ 
      error: 'Failed to auto-fix project',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function checkForErrors(): Promise<string[]> {
  const errors: string[] = [];

  try {
    // Check TypeScript errors
    try {
      const { stdout: tsErrors } = await execAsync('npx tsc --noEmit');
      if (tsErrors.trim()) {
        errors.push(`TypeScript errors: ${tsErrors}`);
      }
    } catch (tsError: any) {
      if (tsError.stdout) {
        errors.push(`TypeScript errors: ${tsError.stdout}`);
      }
    }

    // Check ESLint errors
    try {
      const { stdout: lintErrors } = await execAsync('npx eslint . --ext .ts,.tsx,.js,.jsx');
      if (lintErrors.trim()) {
        errors.push(`ESLint errors: ${lintErrors}`);
      }
    } catch (lintError: any) {
      if (lintError.stdout) {
        errors.push(`ESLint errors: ${lintError.stdout}`);
      }
    }

    // Check build errors
    try {
      const { stdout: buildErrors } = await execAsync('npm run build');
      if (buildErrors.includes('error') || buildErrors.includes('Error')) {
        errors.push(`Build errors: ${buildErrors}`);
      }
    } catch (buildError: any) {
      if (buildError.stdout) {
        errors.push(`Build errors: ${buildError.stdout}`);
      }
    }

  } catch (error) {
    errors.push(`Error checking: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return errors;
}

async function autoFixErrors(errors: string[], userPrompt?: string): Promise<string[]> {
  const fixes: string[] = [];

  try {
    const systemPrompt = `You are an expert software developer and code fixer. You need to fix the following errors in a Next.js project.

Errors to fix:
${errors.join('\n')}

${userPrompt ? `User's additional request: ${userPrompt}` : ''}

Instructions:
1. Analyze each error carefully
2. Provide specific fixes for each error
3. Ensure the fixes are production-ready
4. Follow best practices and conventions
5. Make sure the fixes don't break existing functionality
6. Provide the exact commands or code changes needed

Return your response in the following format:
FIX: [description of the fix]
COMMAND: [command to run or code to change]
EXPLANATION: [why this fix is needed]

Separate multiple fixes with "---"`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Please fix all the errors in this project.' }
      ],
      max_tokens: 4000,
      temperature: 0.3,
    });

    const fixResponse = completion.choices[0]?.message?.content || '';
    
    // Parse and apply fixes
    const fixBlocks = fixResponse.split('---');
    
    for (const block of fixBlocks) {
      if (block.trim()) {
        const lines = block.trim().split('\n');
        let fix = '';
        let command = '';
        let explanation = '';

        for (const line of lines) {
          if (line.startsWith('FIX:')) {
            fix = line.replace('FIX:', '').trim();
          } else if (line.startsWith('COMMAND:')) {
            command = line.replace('COMMAND:', '').trim();
          } else if (line.startsWith('EXPLANATION:')) {
            explanation = line.replace('EXPLANATION:', '').trim();
          }
        }

        if (command) {
          try {
            await execAsync(command);
            fixes.push(`${fix} - ${explanation}`);
          } catch (error) {
            fixes.push(`Failed to apply fix: ${fix} - ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }
    }

  } catch (error) {
    fixes.push(`Error in auto-fix process: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return fixes;
}

async function autoCommitChanges(): Promise<string[]> {
  const commits: string[] = [];

  try {
    // Check if there are changes to commit
    const { stdout: status } = await execAsync('git status --porcelain');
    
    if (status.trim()) {
      // Add all changes
      await execAsync('git add .');
      
      // Create commit message
      const commitMessage = `Auto-fix: ${new Date().toISOString()} - Fixed errors and improved code quality`;
      
      // Commit changes
      await execAsync(`git commit -m "${commitMessage}"`);
      
      commits.push(`Committed changes: ${commitMessage}`);
    } else {
      commits.push('No changes to commit');
    }

  } catch (error) {
    commits.push(`Error committing: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return commits;
}

async function autoPushToGitHub(): Promise<boolean> {
  try {
    // Check if we have a remote origin
    const { stdout: remotes } = await execAsync('git remote -v');
    
    if (!remotes.includes('origin')) {
      throw new Error('No GitHub remote configured');
    }

    // Push to GitHub
    await execAsync('git push origin main');
    
    return true;
  } catch (error) {
    console.error('Error pushing to GitHub:', error);
    return false;
  }
}