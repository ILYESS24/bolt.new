import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Sparkles, 
  Code, 
  Settings, 
  Play, 
  Loader2,
  CheckCircle,
  ExternalLink,
  Github,
  Wrench,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AppGenerator() {
  const { theme } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState({
    framework: 'nextjs',
    language: 'typescript',
    features: ['tailwind', 'auth', 'database'],
    deployToGitHub: false,
    autoFix: true
  });
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai/generate-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          framework: settings.framework,
          language: settings.language,
          features: settings.features,
          deployToGitHub: settings.deployToGitHub,
          autoFix: settings.autoFix,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        toast.success('Application generated successfully!');
      } else {
        throw new Error(data.error || 'Failed to generate application');
      }
    } catch (error) {
      console.error('Error generating application:', error);
      toast.error('Failed to generate application');
    } finally {
      setIsGenerating(false);
    }
  };

  const availableFeatures = [
    { id: 'tailwind', label: 'TailwindCSS', description: 'Utility-first CSS framework' },
    { id: 'auth', label: 'Authentication', description: 'NextAuth.js integration' },
    { id: 'database', label: 'Database', description: 'Prisma ORM with PostgreSQL' },
    { id: 'api', label: 'API Routes', description: 'RESTful API endpoints' },
    { id: 'ui', label: 'UI Components', description: 'Reusable UI components' },
    { id: 'testing', label: 'Testing', description: 'Jest and React Testing Library' },
    { id: 'deployment', label: 'Deployment', description: 'Vercel deployment config' },
  ];

  const handleFeatureToggle = (featureId: string) => {
    setSettings(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            AI App Generator
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Generate complete applications with AI
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Prompt Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe your application
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a todo app with user authentication, dark mode, and real-time updates..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            rows={4}
          />
        </div>

        {/* Settings */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Framework
              </label>
              <select
                value={settings.framework}
                onChange={(e) => setSettings({ ...settings, framework: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="nextjs">Next.js</option>
                <option value="react">React</option>
                <option value="vue">Vue.js</option>
                <option value="svelte">Svelte</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
              </select>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Features
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableFeatures.map((feature) => (
                <label key={feature.id} className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.features.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                    className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {feature.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="mt-4 space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.autoFix}
                onChange={(e) => setSettings({ ...settings, autoFix: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Auto-fix errors and optimize code
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.deployToGitHub}
                onChange={(e) => setSettings({ ...settings, deployToGitHub: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Deploy to GitHub automatically
              </span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="p-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Application...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Generate Application
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Generation Complete
            </h4>
            
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                <div className="text-sm text-green-700 dark:text-green-300">
                  {result.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <FileText className="w-3 h-3 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {result.files?.length || 0} files
                  </span>
                </div>
                
                {result.deployed && (
                  <div className="flex items-center space-x-1">
                    <Github className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Deployed
                    </span>
                  </div>
                )}
              </div>

              {result.githubUrl && (
                <a
                  href={result.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View on GitHub
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}