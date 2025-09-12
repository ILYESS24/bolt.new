import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Wrench, 
  CheckCircle, 
  XCircle, 
  GitCommit, 
  GitBranch, 
  Loader2,
  AlertTriangle,
  Settings,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AutoFixPanelProps {
  projectId: string;
}

export default function AutoFixPanel({ projectId }: AutoFixPanelProps) {
  const { theme } = useAppStore();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [settings, setSettings] = useState({
    autoFix: true,
    autoCommit: true,
    autoPush: false,
    customPrompt: ''
  });

  const handleAutoFix = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      const response = await fetch('/api/ai/auto-fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          prompt: settings.customPrompt,
          autoFix: settings.autoFix,
          autoCommit: settings.autoCommit,
          autoPush: settings.autoPush,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
        toast.success('Auto-fix completed successfully!');
      } else {
        throw new Error(data.error || 'Failed to auto-fix');
      }
    } catch (error) {
      console.error('Error running auto-fix:', error);
      toast.error('Failed to run auto-fix');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Auto-Fix & Deploy
            </h3>
          </div>
          <Settings className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Auto-Fix Settings
        </h4>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.autoFix}
              onChange={(e) => setSettings({ ...settings, autoFix: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Auto-fix errors
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.autoCommit}
              onChange={(e) => setSettings({ ...settings, autoCommit: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Auto-commit changes
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.autoPush}
              onChange={(e) => setSettings({ ...settings, autoPush: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Auto-push to GitHub
            </span>
          </label>
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom Prompt (Optional)
          </label>
          <textarea
            value={settings.customPrompt}
            onChange={(e) => setSettings({ ...settings, customPrompt: e.target.value })}
            placeholder="Additional instructions for the AI..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            rows={2}
          />
        </div>
      </div>

      {/* Run Button */}
      <div className="p-4">
        <button
          onClick={handleAutoFix}
          disabled={isRunning}
          className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Auto-Fix...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Auto-Fix
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="flex-1 p-4 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Results
          </h4>
          
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center space-x-2">
              {getStatusIcon(results.success)}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {results.message}
              </span>
            </div>

            {/* Errors Found */}
            {results.errors && results.errors.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Errors Found ({results.errors.length})
                </h5>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  {results.errors.map((error: string, index: number) => (
                    <div key={index} className="text-xs text-red-700 dark:text-red-300 mb-1">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fixes Applied */}
            {results.fixes && results.fixes.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center">
                  <Wrench className="w-4 h-4 mr-1" />
                  Fixes Applied ({results.fixes.length})
                </h5>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                  {results.fixes.map((fix: string, index: number) => (
                    <div key={index} className="text-xs text-green-700 dark:text-green-300 mb-1">
                      {fix}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Commits */}
            {results.commits && results.commits.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                  <GitCommit className="w-4 h-4 mr-1" />
                  Commits ({results.commits.length})
                </h5>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                  {results.commits.map((commit: string, index: number) => (
                    <div key={index} className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                      {commit}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Push Status */}
            {results.pushed !== undefined && (
              <div className="flex items-center space-x-2">
                {results.pushed ? (
                  <GitBranch className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {results.pushed ? 'Successfully pushed to GitHub' : 'Failed to push to GitHub'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}