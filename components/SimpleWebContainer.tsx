import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Square, 
  RefreshCw, 
  Download, 
  Upload,
  Terminal as TerminalIcon,
  Code,
  Globe,
  Settings,
  Zap
} from 'lucide-react';

interface SimpleWebContainerProps {
  projectFiles?: Array<{
    name: string;
    content: string;
    path: string;
  }>;
  onPreview?: (url: string) => void;
  onError?: (error: string) => void;
}

export default function SimpleWebContainer({ 
  projectFiles = [], 
  onPreview, 
  onError 
}: SimpleWebContainerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'terminal' | 'preview' | 'files'>('terminal');
  const [terminalOutput, setTerminalOutput] = useState<string>('');

  useEffect(() => {
    // Simulate WebContainer initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
      addLog('✅ Simple WebContainer initialized successfully');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (projectFiles.length > 0) {
      addLog(`📁 ${projectFiles.length} files loaded`);
    }
  }, [projectFiles]);

  const startDevServer = async () => {
    try {
      setIsRunning(true);
      addLog('🚀 Starting development server...');
      
      // Simulate server startup
      setTimeout(() => {
        const mockUrl = 'http://localhost:3000';
        setPreviewUrl(mockUrl);
        onPreview?.(mockUrl);
        addLog(`🚀 Server started on port 3000: ${mockUrl}`);
      }, 3000);

    } catch (error) {
      console.error('Failed to start dev server:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to start server');
      setIsRunning(false);
    }
  };

  const stopServer = async () => {
    setIsRunning(false);
    setPreviewUrl('');
    addLog('⏹️ Server stopped');
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-50), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const executeCommand = (command: string) => {
    addLog(`$ ${command}`);
    
    // Simulate command execution
    setTimeout(() => {
      const output = `Command executed: ${command}`;
      setTerminalOutput(prev => prev + output + '\n');
      addLog(output);
    }, 500);
  };

  const downloadProject = async () => {
    const projectData = {
      files: projectFiles,
      timestamp: new Date().toISOString(),
      type: 'simple-webcontainer-project'
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simple-webcontainer-project.json';
    a.click();
    URL.revokeObjectURL(url);
    
    addLog('📥 Project downloaded');
  };

  return (
    <div className="h-full flex flex-col glass-dark">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <TerminalIcon className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">Simple WebContainer</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-300">
              {isRunning ? 'Running' : 'Stopped'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={startDevServer}
            disabled={isRunning || isLoading}
            className="glass-button flex items-center space-x-2 text-sm"
          >
            <Play className="w-4 h-4" />
            <span>Start</span>
          </button>
          
          <button
            onClick={stopServer}
            disabled={!isRunning}
            className="glass-button flex items-center space-x-2 text-sm"
          >
            <Square className="w-4 h-4" />
            <span>Stop</span>
          </button>
          
          <button
            onClick={downloadProject}
            className="glass-button flex items-center space-x-2 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {[
          { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
          { id: 'preview', label: 'Preview', icon: Globe },
          { id: 'files', label: 'Files', icon: Code }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
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
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'terminal' && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1 p-4">
                <div className="w-full h-full terminal-glass p-4 font-mono text-sm">
                  <div className="text-green-400 mb-4">
                    <div className="flex items-center space-x-2">
                      <TerminalIcon className="w-4 h-4" />
                      <span>Simple Terminal</span>
                    </div>
                  </div>
                  
                  <div className="text-gray-300 mb-4">
                    <div>Welcome to Simple WebContainer Terminal!</div>
                    <div>Type commands below and press Enter to execute.</div>
                  </div>
                  
                  <div className="text-white mb-4">
                    <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">$</span>
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-none outline-none text-white"
                      placeholder="Enter command..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const command = e.currentTarget.value;
                          if (command.trim()) {
                            executeCommand(command);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="h-32 overflow-y-auto p-4 border-t border-white/10">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Logs</h4>
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-xs text-gray-400 font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title="WebContainer Preview"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No Preview Available
                    </h3>
                    <p className="text-gray-400">
                      Start the development server to see the preview
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
              className="h-full p-4"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Project Files</h3>
                
                {projectFiles.length > 0 ? (
                  <div className="space-y-2">
                    {projectFiles.map((file, index) => (
                      <div key={index} className="glass-card p-3">
                        <div className="flex items-center space-x-3">
                          <Code className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className="text-white font-medium">{file.name}</div>
                            <div className="text-gray-400 text-sm">{file.path}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No Files Loaded
                    </h3>
                    <p className="text-gray-400">
                      Files will appear here when loaded
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="glass-card text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white">Initializing Simple WebContainer...</p>
          </div>
        </div>
      )}
    </div>
  );
}