import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { 
  Sparkles, 
  Code, 
  Palette, 
  Zap, 
  Globe, 
  Terminal,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Play,
  Save,
  Download,
  Upload,
  RefreshCw,
  Maximize2,
  Minimize2,
  Layers,
  Eye,
  FileText,
  Database,
  Cpu,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import our custom components
import SimpleWebContainer from '@/components/SimpleWebContainer';
import AdvancedAppGenerator from '@/components/AdvancedAppGenerator';
import SimpleVisualEditor from '@/components/SimpleVisualEditor';
import CodeEditor from '@/components/CodeEditor';
import TerminalComponent from '@/components/Terminal';
import AutoFixPanel from '@/components/AutoFixPanel';

type TabType = 'generator' | 'visual' | 'code' | 'terminal' | 'preview' | 'settings';

export default function Studio() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('generator');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [webContainerFiles, setWebContainerFiles] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  const tabs = [
    { id: 'generator', label: 'AI Generator', icon: Sparkles, color: 'text-purple-400' },
    { id: 'visual', label: 'Visual Editor', icon: Palette, color: 'text-pink-400' },
    { id: 'code', label: 'Code Editor', icon: Code, color: 'text-blue-400' },
    { id: 'terminal', label: 'Terminal', icon: Terminal, color: 'text-green-400' },
    { id: 'preview', label: 'Preview', icon: Eye, color: 'text-yellow-400' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-400' },
  ];

  const handleProjectGenerated = (project: any) => {
    setCurrentProject(project);
    setWebContainerFiles(project.files || []);
    toast.success('Project generated successfully!');
  };

  const handleSave = () => {
    toast.success('Project saved successfully!');
  };

  const handleExport = () => {
    toast.success('Project exported successfully!');
  };

  if (status === 'loading') {
    return (
      <div className="h-screen animated-bg flex items-center justify-center">
        <div className="glass-card text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white text-lg">Loading Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col animated-bg ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="h-16 glass-dark border-b border-white/10 flex items-center justify-between px-6"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 glass rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BoltAI Studio</h1>
              <p className="text-xs text-gray-400">Advanced AI Builder</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Project Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="glass-button flex items-center space-x-2 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            
            <button
              onClick={handleExport}
              className="glass-button flex items-center space-x-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="glass-button flex items-center space-x-2 text-sm"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 glass rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm">{session?.user?.name}</span>
            </div>
            
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="glass-dark border-r border-white/10 flex flex-col"
            >
              {/* Tab Navigation */}
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Workspace
                </h3>
                <div className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-400/20 text-blue-400 border border-blue-400/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <tab.icon className={`w-4 h-4 ${tab.color}`} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Info */}
              {currentProject && (
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Current Project
                  </h3>
                  <div className="glass-card p-3">
                    <div className="text-white font-medium text-sm mb-1">
                      {currentProject.name || 'Untitled Project'}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {currentProject.framework} • {currentProject.language}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>{currentProject.files?.length || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Database className="w-3 h-3" />
                        <span>{currentProject.dependencies?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full glass-button flex items-center space-x-2 text-sm">
                    <Upload className="w-4 h-4" />
                    <span>Import Project</span>
                  </button>
                  <button className="w-full glass-button flex items-center space-x-2 text-sm">
                    <RefreshCw className="w-4 h-4" />
                    <span>New Project</span>
                  </button>
                  <button className="w-full glass-button flex items-center space-x-2 text-sm">
                    <Layers className="w-4 h-4" />
                    <span>Templates</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'generator' && (
                <motion.div
                  key="generator"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <AdvancedAppGenerator onProjectGenerated={handleProjectGenerated} />
                </motion.div>
              )}

              {activeTab === 'visual' && (
                <motion.div
                  key="visual"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <SimpleVisualEditor onSave={handleSave} onExport={handleExport} />
                </motion.div>
              )}

              {activeTab === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <div className="h-full flex">
                    <div className="flex-1">
                      <CodeEditor
                        file={{
                          name: 'App.tsx',
                          content: currentProject?.files?.[0]?.content || '// Start coding here...',
                          language: 'typescript',
                          path: '/App.tsx'
                        }}
                        onContentChange={(content) => {
                          // Handle content change
                        }}
                      />
                    </div>
                    <div className="w-80 border-l border-white/10">
                      <AutoFixPanel projectId="current" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'terminal' && (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <SimpleWebContainer 
                    projectFiles={webContainerFiles}
                    onPreview={(url) => {
                      toast.success(`Preview available at ${url}`);
                    }}
                    onError={(error) => {
                      toast.error(`Error: ${error}`);
                    }}
                  />
                </motion.div>
              )}

              {activeTab === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Live Preview
                      </h3>
                      <p className="text-gray-400 mb-6">
                        Your application preview will appear here
                      </p>
                      <button className="glass-button flex items-center space-x-2 mx-auto">
                        <Play className="w-4 h-4" />
                        <span>Start Preview</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full p-6"
                >
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="glass-card">
                      <h3 className="text-lg font-semibold text-white mb-4">Studio Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Theme
                          </label>
                          <select className="glass-input w-full">
                            <option value="glassmorphic">Glassmorphic</option>
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            AI Model
                          </label>
                          <select className="glass-input w-full">
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                            <option value="claude">Claude</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-400 bg-transparent border-white/20 rounded focus:ring-blue-400"
                            />
                            <span className="text-white">Auto-save</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}