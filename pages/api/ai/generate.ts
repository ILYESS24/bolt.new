import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import OpenAI from 'openai';
import { AIGenerationRequest, AIGenerationResponse } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { prompt, context, language, framework }: AIGenerationRequest = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const systemPrompt = `You are an expert software developer. Generate clean, production-ready code based on the user's request.

${context ? `Context: ${context}` : ''}
${language ? `Preferred language: ${language}` : ''}
${framework ? `Framework: ${framework}` : ''}

Instructions:
- Generate complete, working code
- Include proper imports and dependencies
- Add comments for complex logic
- Follow best practices and conventions
- If multiple files are needed, structure them properly
- Make the code immediately runnable

Return only the code, no explanations unless specifically requested.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const generatedCode = completion.choices[0]?.message?.content || '';

    // Parse the response to extract files if multiple files are generated
    const files = parseGeneratedCode(generatedCode, language || 'javascript');

    const response: AIGenerationResponse = {
      code: generatedCode,
      files: files,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
}

function parseGeneratedCode(code: string, defaultLanguage: string) {
  const files = [];
  
  // Simple parsing for multiple files (looks for file markers)
  const fileMarkers = code.match(/```(\w+)?\s*\/\/\s*file:\s*([^\n]+)/g);
  
  if (fileMarkers) {
    let currentFile = '';
    let currentLanguage = defaultLanguage;
    let currentPath = '';
    
    const lines = code.split('\n');
    
    for (const line of lines) {
      const fileMatch = line.match(/```(\w+)?\s*\/\/\s*file:\s*([^\n]+)/);
      
      if (fileMatch) {
        // Save previous file
        if (currentFile && currentPath) {
          files.push({
            name: currentPath.split('/').pop() || 'file',
            content: currentFile.trim(),
            language: currentLanguage,
            path: currentPath,
          });
        }
        
        // Start new file
        currentLanguage = fileMatch[1] || defaultLanguage;
        currentPath = fileMatch[2].trim();
        currentFile = '';
      } else if (line.startsWith('```') && !line.includes('file:')) {
        // Skip code block markers
        continue;
      } else if (currentPath) {
        currentFile += line + '\n';
      }
    }
    
    // Save last file
    if (currentFile && currentPath) {
      files.push({
        name: currentPath.split('/').pop() || 'file',
        content: currentFile.trim(),
        language: currentLanguage,
        path: currentPath,
      });
    }
  } else {
    // Single file
    const cleanCode = code.replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
    files.push({
      name: 'generated.js',
      content: cleanCode,
      language: defaultLanguage,
      path: '/generated.js',
    });
  }
  
  return files;
}