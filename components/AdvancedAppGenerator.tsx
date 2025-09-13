import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FileText,
  Palette,
  Zap,
  Globe,
  Shield,
  Layers,
  Cpu,
  Database,
  Users,
  Eye,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdvancedAppGeneratorProps {
  onProjectGenerated?: (project: any) => void;
}

export default function AdvancedAppGenerator({ onProjectGenerated }: AdvancedAppGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState({
    framework: 'nextjs' as 'nextjs' | 'react' | 'vue' | 'svelte' | 'vanilla',
    language: 'typescript' as 'typescript' | 'javascript',
    features: ['tailwind', 'framer-motion', 'auth', 'database', 'ui'],
    style: 'glassmorphic' as 'modern' | 'minimal' | 'glassmorphic' | 'neon' | 'dark',
    complexity: 'intermediate' as 'simple' | 'intermediate' | 'advanced',
    deployToGitHub: false,
    includeTests: false,
    includeDocs: false
  });
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'generator' | 'preview' | 'files'>('generator');

  const availableFeatures = [
    { id: 'tailwind', label: 'TailwindCSS', description: 'Utility-first CSS framework', icon: Palette },
    { id: 'framer-motion', label: 'Framer Motion', description: 'Animation library', icon: Zap },
    { id: 'auth', label: 'Authentication', description: 'NextAuth.js integration', icon: Shield },
    { id: 'database', label: 'Database', description: 'Prisma ORM with PostgreSQL', icon: Database },
    { id: 'ui', label: 'UI Components', description: 'Headless UI components', icon: Layers },
    { id: 'forms', label: 'Forms', description: 'React Hook Form with validation', icon: FileText },
    { id: 'state', label: 'State Management', description: 'Zustand state management', icon: Cpu },
    { id: 'api', label: 'API Integration', description: 'Axios HTTP client', icon: Globe },
    { id: 'tests', label: 'Testing', description: 'Jest testing framework', icon: CheckCircle },
    { id: 'docs', label: 'Documentation', description: 'Comprehensive docs', icon: FileText }
  ];

  const styleOptions = [
    { id: 'glassmorphic', label: 'Glassmorphic', description: 'Modern glass-like design', preview: '🔮' },
    { id: 'modern', label: 'Modern', description: 'Clean contemporary design', preview: '✨' },
    { id: 'minimal', label: 'Minimal', description: 'Simple and clean', preview: '⚪' },
    { id: 'neon', label: 'Neon', description: 'Cyberpunk with glowing effects', preview: '💫' },
    { id: 'dark', label: 'Dark', description: 'Dark theme with high contrast', preview: '🌙' }
  ];

  const complexityOptions = [
    { id: 'simple', label: 'Simple', description: 'Basic functionality', level: 1 },
    { id: 'intermediate', label: 'Intermediate', description: 'Moderate complexity', level: 2 },
    { id: 'advanced', label: 'Advanced', description: 'Full-featured application', level: 3 }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a detailed prompt');
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai/advanced-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          framework: settings.framework,
          language: settings.language,
          features: settings.features,
          style: settings.style,
          complexity: settings.complexity,
          deployToGitHub: settings.deployToGitHub,
          includeTests: settings.includeTests,
          includeDocs: settings.includeDocs,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setActiveTab('preview');
        onProjectGenerated?.(data);
        toast.success('Advanced application generated successfully!');
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

  const handleFeatureToggle = (featureId: string) => {
    setSettings(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const getComplexityColor = (level: number) => {
    switch (level) {
      case 1: return 'text-green-400';
      case 2: return 'text-yellow-400';
      case 3: return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col glass-dark">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 glass rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Advanced AI Builder</h2>
              <p className="text-gray-400">Generate complete applications with AI</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="glass-button">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {[
          { id: 'generator', label: 'Generator', icon: Sparkles },
          { id: 'preview', label: 'Preview', icon: Eye },
          { id: 'files', label: 'Files', icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-blue-400 bg-white/5'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'generator' && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 space-y-6"
            >
              {/* Prompt Input */}
              <div className="glass-card">
                <div className="flex items-center space-x-2 mb-4">
                  <Code className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Application Prompt</h3>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your application in detail... e.g., 'Create a modern e-commerce platform with user authentication, product catalog, shopping cart, and payment integration. Use a glassmorphic design with dark theme and smooth animations.'"
                  className="glass-input w-full h-32 resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {prompt.length}/1000 characters
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">AI Ready</span>
                  </div>
                </div>
              </div>

              {/* Framework & Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card">
                  <div className="flex items-center space-x-2 mb-4">
                    <Settings className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Framework</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: 'nextjs', label: 'Next.js', description: 'Full-stack React framework' },
                      { id: 'react', label: 'React', description: 'Component-based library' },
                      { id: 'vue', label: 'Vue.js', description: 'Progressive framework' },
                      { id: 'svelte', label: 'Svelte', description: 'Compile-time framework' },
                      { id: 'vanilla', label: 'Vanilla', description: 'Pure HTML/CSS/JS' }
                    ].map((framework) => (
                      <label key={framework.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <input
                          type="radio"
                          name="framework"
                          value={framework.id}
                          checked={settings.framework === framework.id}
                          onChange={(e) => setSettings({ ...settings, framework: e.target.value as any })}
                          className="w-4 h-4 text-blue-400 bg-transparent border-white/20 focus:ring-blue-400"
                        />
                        <div>
                          <div className="text-white font-medium">{framework.label}</div>
                          <div className="text-xs text-gray-400">{framework.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="glass-card">
                  <div className="flex items-center space-x-2 mb-4">
                    <Code className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Language</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: 'typescript', label: 'TypeScript', description: 'Type-safe JavaScript' },
                      { id: 'javascript', label: 'JavaScript', description: 'Dynamic scripting language' }
                    ].map((lang) => (
                      <label key={lang.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <input
                          type="radio"
                          name="language"
                          value={lang.id}
                          checked={settings.language === lang.id}
                          onChange={(e) => setSettings({ ...settings, language: e.target.value as any })}
                          className="w-4 h-4 text-blue-400 bg-transparent border-white/20 focus:ring-blue-400"
                        />
                        <div>
                          <div className="text-white font-medium">{lang.label}</div>
                          <div className="text-xs text-gray-400">{lang.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Style Selection */}
              <div className="glass-card">
                <div className="flex items-center space-x-2 mb-4">
                  <Palette className="w-5 h-5 text-pink-400" />
                  <h3 className="text-lg font-semibold text-white">Design Style</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {styleOptions.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSettings({ ...settings, style: style.id as any })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.style === style.id
                          ? 'border-blue-400 bg-blue-400/10'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="text-2xl mb-2">{style.preview}</div>
                      <div className="text-white font-medium text-sm">{style.label}</div>
                      <div className="text-xs text-gray-400">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Complexity */}
              <div className="glass-card">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Complexity Level</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {complexityOptions.map((complexity) => (
                    <button
                      key={complexity.id}
                      onClick={() => setSettings({ ...settings, complexity: complexity.id as any })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.complexity === complexity.id
                          ? 'border-blue-400 bg-blue-400/10'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className={`text-2xl mb-2 ${getComplexityColor(complexity.level)}`}>
                        {'⚡'.repeat(complexity.level)}
                      </div>
                      <div className="text-white font-medium text-sm">{complexity.label}</div>
                      <div className="text-xs text-gray-400">{complexity.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="glass-card">
                <div className="flex items-center space-x-2 mb-4">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-white">Features</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableFeatures.map((feature) => (
                    <label key={feature.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.features.includes(feature.id)}
                        onChange={() => handleFeatureToggle(feature.id)}
                        className="w-4 h-4 text-blue-400 bg-transparent border-white/20 rounded focus:ring-blue-400 mt-0.5"
                      />
                      <div className="flex items-center space-x-2">
                        <feature.icon className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-white font-medium text-sm">{feature.label}</div>
                          <div className="text-xs text-gray-400">{feature.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="glass-card">
                <div className="flex items-center space-x-2 mb-4">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-white">Additional Options</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.includeTests}
                      onChange={(e) => setSettings({ ...settings, includeTests: e.target.checked })}
                      className="w-4 h-4 text-blue-400 bg-transparent border-white/20 rounded focus:ring-blue-400"
                    />
                    <div>
                      <div className="text-white font-medium">Include Tests</div>
                      <div className="text-xs text-gray-400">Add Jest test files</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.includeDocs}
                      onChange={(e) => setSettings({ ...settings, includeDocs: e.target.checked })}
                      className="w-4 h-4 text-blue-400 bg-transparent border-white/20 rounded focus:ring-blue-400"
                    />
                    <div>
                      <div className="text-white font-medium">Include Documentation</div>
                      <div className="text-xs text-gray-400">Add comprehensive docs</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.deployToGitHub}
                      onChange={(e) => setSettings({ ...settings, deployToGitHub: e.target.checked })}
                      className="w-4 h-4 text-blue-400 bg-transparent border-white/20 rounded focus:ring-blue-400"
                    />
                    <div>
                      <div className="text-white font-medium">Deploy to GitHub</div>
                      <div className="text-xs text-gray-400">Automatically push to repository</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Generate Button */}
              <div className="glass-card">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full glass-button flex items-center justify-center py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Generating Advanced Application...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-3" />
                      Generate Application
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6"
            >
              {result ? (
                <div className="space-y-6">
                  <div className="glass-card">
                    <div className="flex items-center space-x-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Generation Complete</h3>
                    </div>
                    <div className="text-green-400 mb-4">{result.message}</div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{result.files?.length || 0}</div>
                        <div className="text-xs text-gray-400">Files</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{result.dependencies?.length || 0}</div>
                        <div className="text-xs text-gray-400">Dependencies</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{settings.framework}</div>
                        <div className="text-xs text-gray-400">Framework</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{settings.style}</div>
                        <div className="text-xs text-gray-400">Style</div>
                      </div>
                    </div>

                    {result.githubUrl && (
                      <div className="flex items-center space-x-2">
                        <Github className="w-4 h-4 text-gray-400" />
                        <a
                          href={result.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View on GitHub
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="glass-card">
                    <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Preview will be available after deployment</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Preview Available
                    </h3>
                    <p className="text-gray-400">
                      Generate an application to see the preview
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'files' && (
            <motion.div
              key="files"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6"
            >
              {result?.files ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Generated Files</h3>
                    <div className="flex items-center space-x-2">
                      <button className="glass-button text-sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {result.files.map((file: any, index: number) => (
                      <div key={index} className="glass-card p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 glass rounded flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              <div className="text-white font-medium">{file.name}</div>
                              <div className="text-xs text-gray-400">{file.path}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-blue-400/20 text-blue-400 text-xs rounded">
                              {file.type}
                            </span>
                            <span className="px-2 py-1 bg-gray-400/20 text-gray-400 text-xs rounded">
                              {file.language}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Files Generated
                    </h3>
                    <p className="text-gray-400">
                      Generate an application to see the files
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}