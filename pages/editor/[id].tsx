import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/lib/store';
import { Project, File } from '@/types';
import CodeEditor from '@/components/CodeEditor';
import FileExplorer from '@/components/FileExplorer';
import AIPanel from '@/components/AIPanel';
import Terminal from '@/components/Terminal';
import AutoFixPanel from '@/components/AutoFixPanel';
import AppGenerator from '@/components/AppGenerator';
import { 
  Play, 
  Save, 
  Share2, 
  Download, 
  Settings, 
  Moon, 
  Sun,
  Menu,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditorPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const { 
    currentProject, 
    setCurrentProject, 
    files, 
    setFiles, 
    activeFile, 
    setActiveFile,
    sidebarOpen,
    setSidebarOpen,
    theme,
    setTheme,
    isGenerating
  } = useAppStore();
  
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showAutoFix, setShowAutoFix] = useState(false);
  const [showAppGenerator, setShowAppGenerator] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (id && status === 'authenticated') {
      fetchProject();
    }
  }, [id, status]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (response.ok) {
        const project: Project = await response.json();
        setCurrentProject(project);
        
        // Initialize files if project has files
        if (project.files && project.files.length > 0) {
          setFiles(project.files);
          if (project.files.length > 0) {
            setActiveFile(project.files[0].path);
          }
        } else {
          // Create default files for new projects
          const defaultFiles: File[] = [
            {
              name: 'index.html',
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <h1>Hello, World!</h1>
        <p>Welcome to your new project.</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
              language: 'html',
              path: '/index.html',
            },
            {
              name: 'style.css',
              content: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

#app {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    line-height: 1.6;
}`,
              language: 'css',
              path: '/style.css',
            },
            {
              name: 'script.js',
              content: `// JavaScript file
console.log('Hello, World!');

// Add some interactivity
document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    
    app.addEventListener('click', function() {
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});`,
              language: 'javascript',
              path: '/script.js',
            },
          ];
          setFiles(defaultFiles);
          setActiveFile('/index.html');
        }
      } else {
        router.push('/404');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      router.push('/404');
    }
  };

  const handleSave = async () => {
    if (!currentProject) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: currentProject.name,
          description: currentProject.description,
          files: files,
        }),
      });

      if (response.ok) {
        toast.success('Project saved successfully');
      } else {
        throw new Error('Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleRun = () => {
    // In a real implementation, this would start a development server
    toast.success('Starting development server...');
    setShowTerminal(true);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/projects/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Project link copied to clipboard!');
  };

  const handleDownload = () => {
    // Create a zip file with all project files
    toast.success('Downloading project files...');
  };

  const getActiveFile = () => {
    return files.find(file => file.path === activeFile);
  };

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading project...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Bar */}
      <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {currentProject.name}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRun}
            className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4 mr-1" />
            Run
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4 mr-1" />
            {saving ? 'Saving...' : 'Save'}
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Share project"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Download project"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 300 }}
              exit={{ width: 0 }}
              className="flex-shrink-0 border-r border-gray-200 dark:border-gray-700"
            >
              <FileExplorer />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor */}
          <div className="flex-1 flex">
            <div className="flex-1">
              {activeFile && getActiveFile() ? (
                <CodeEditor
                  file={getActiveFile()!}
                  onContentChange={(content) => {
                    // Content is automatically saved to store
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No file selected
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Select a file from the sidebar to start editing
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Panel */}
            <AnimatePresence>
              {showAIPanel && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 350 }}
                  exit={{ width: 0 }}
                  className="border-l border-gray-200 dark:border-gray-700"
                >
                  <AIPanel />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auto-Fix Panel */}
            <AnimatePresence>
              {showAutoFix && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 350 }}
                  exit={{ width: 0 }}
                  className="border-l border-gray-200 dark:border-gray-700"
                >
                  <AutoFixPanel projectId={id as string} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* App Generator Panel */}
            <AnimatePresence>
              {showAppGenerator && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 400 }}
                  exit={{ width: 0 }}
                  className="border-l border-gray-200 dark:border-gray-700"
                >
                  <AppGenerator />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Terminal */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 300 }}
                exit={{ height: 0 }}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <Terminal />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="h-8 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Files: {files.length}</span>
          {activeFile && (
            <span>Active: {getActiveFile()?.name}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className={`flex items-center space-x-1 ${
              showAIPanel ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <span>AI</span>
            {showAIPanel ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
          
          <button
            onClick={() => setShowAutoFix(!showAutoFix)}
            className={`flex items-center space-x-1 ${
              showAutoFix ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <span>Auto-Fix</span>
            {showAutoFix ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
          
          <button
            onClick={() => setShowAppGenerator(!showAppGenerator)}
            className={`flex items-center space-x-1 ${
              showAppGenerator ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <span>Generator</span>
            {showAppGenerator ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
          
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`flex items-center space-x-1 ${
              showTerminal ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <span>Terminal</span>
            {showTerminal ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}