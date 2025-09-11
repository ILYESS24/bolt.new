import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    // For demo purposes, we'll simulate command execution
    // In a real implementation, this would connect to a WebContainer or similar
    const result = await simulateCommand(command);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error executing command:', error);
    res.status(500).json({ error: 'Failed to execute command' });
  }
}

async function simulateCommand(command: string) {
  const cmd = command.trim().toLowerCase();
  
  // Simulate different commands
  if (cmd === 'ls' || cmd === 'dir') {
    return {
      output: `package.json\nsrc/\npublic/\nnode_modules/\nREADME.md`
    };
  }
  
  if (cmd === 'pwd') {
    return {
      output: '/workspace'
    };
  }
  
  if (cmd === 'npm install') {
    return {
      output: `npm WARN deprecated some-package@1.0.0: This package is deprecated
added 1234 packages in 45s`
    };
  }
  
  if (cmd === 'npm start') {
    return {
      output: `> project@1.0.0 start
> next dev

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Loaded env from .env.local`
    };
  }
  
  if (cmd === 'npm run build') {
    return {
      output: `> project@1.0.0 build
> next build

info  - Creating optimized production build
info  - Compiled successfully
info  - Linting and checking validity of types
info  - Collecting page data
info  - Generating static pages (0/1)
info  - Finalizing page optimization

Page                                                           Size     First Load JS
┌ ○ /                                                          1.2 kB         85.2 kB
├   /_app                                                       0 B            84 kB
└ ○ /404                                                        1.2 kB         85.2 kB

+ First Load JS shared by all                                  84 kB
  ├ chunks/framework-1234567890abcdef.js                       45.2 kB
  ├ chunks/main-1234567890abcdef.js                            32.8 kB
  ├ chunks/pages/_app-1234567890abcdef.js                      6 kB
  └ chunks/webpack-1234567890abcdef.js                         2.1 kB

○  (Static)  automatically rendered as static HTML (uses getStaticProps)`
    };
  }
  
  if (cmd.startsWith('echo ')) {
    const message = command.substring(5);
    return {
      output: message
    };
  }
  
  if (cmd === 'help') {
    return {
      output: `Available commands:
  ls, dir          - List directory contents
  pwd              - Print working directory
  npm install      - Install dependencies
  npm start        - Start development server
  npm run build    - Build for production
  echo <message>   - Print message
  help             - Show this help message`
    };
  }
  
  // Default response for unknown commands
  return {
    error: `Command not found: ${command}. Type 'help' for available commands.`
  };
}