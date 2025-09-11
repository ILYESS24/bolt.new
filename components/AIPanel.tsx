import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Send, Sparkles, Loader2, Code, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIPanel() {
  const { files, addFile, isGenerating, setIsGenerating } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [framework, setFramework] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          context: context.trim() || undefined,
          language: language,
          framework: framework.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const data = await response.json();
      
      if (data.files && data.files.length > 0) {
        // Add generated files
        data.files.forEach((file: any) => {
          addFile(file);
        });
        toast.success(`Generated ${data.files.length} file(s)`);
      } else if (data.code) {
        // Add single generated code
        const fileName = `generated-${Date.now()}.${getExtensionFromLanguage(language)}`;
        addFile({
          name: fileName,
          content: data.code,
          language: language,
          path: `/${fileName}`,
        });
        toast.success('Code generated successfully');
      }
      
      // Clear the prompt
      setPrompt('');
      
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getExtensionFromLanguage = (lang: string) => {
    const extMap: { [key: string]: string } = {
      'javascript': 'js',
      'typescript': 'ts',
      'python': 'py',
      'html': 'html',
      'css': 'css',
      'json': 'json',
    };
    return extMap[lang] || 'js';
  };

  const quickPrompts = [
    'Create a React component for a todo list',
    'Build a REST API with Express.js',
    'Create a responsive CSS grid layout',
    'Generate a Python data analysis script',
    'Build a simple HTML landing page',
    'Create a TypeScript utility function',
  ];

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Generate code with AI assistance
        </p>
      </div>

      {/* Quick prompts */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Prompts</h4>
        <div className="space-y-2">
          {quickPrompts.map((quickPrompt, index) => (
            <button
              key={index}
              onClick={() => setPrompt(quickPrompt)}
              className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              {quickPrompt}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to build?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to create..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Context (optional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Additional context or requirements..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Framework
            </label>
            <input
              type="text"
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              placeholder="React, Vue, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Generate Code
            </>
          )}
        </button>
      </div>

      {/* Current files info */}
      {files.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>{files.length} file{files.length !== 1 ? 's' : ''} in project</span>
          </div>
        </div>
      )}
    </div>
  );
}