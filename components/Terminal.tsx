import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Terminal as TerminalIcon, Play, Square, Trash2 } from 'lucide-react';

export default function Terminal() {
  const { terminalOutput, addTerminalOutput, clearTerminal } = useAppStore();
  const [command, setCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    setIsRunning(true);
    addTerminalOutput(`$ ${cmd}`);
    
    try {
      // Simulate command execution
      // In a real implementation, this would connect to a WebContainer or similar
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: cmd }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.output) {
          addTerminalOutput(data.output);
        }
        if (data.error) {
          addTerminalOutput(`Error: ${data.error}`);
        }
      } else {
        addTerminalOutput('Command not found or failed to execute');
      }
    } catch (error) {
      addTerminalOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(command);
    setCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="h-full bg-gray-900 text-green-400 flex flex-col font-mono">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => executeCommand('npm start')}
            disabled={isRunning}
            className="p-1 text-green-400 hover:text-green-300 disabled:opacity-50"
            title="Run project"
          >
            <Play className="w-4 h-4" />
          </button>
          <button
            onClick={clearTerminal}
            className="p-1 text-gray-400 hover:text-gray-300"
            title="Clear terminal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Output */}
      <div
        ref={terminalRef}
        className="flex-1 p-3 overflow-y-auto text-sm"
        style={{ minHeight: '200px' }}
      >
        {terminalOutput.length === 0 ? (
          <div className="text-gray-500">
            <p>Welcome to the terminal!</p>
            <p>Try running: npm install, npm start, or ls</p>
          </div>
        ) : (
          terminalOutput.map((line, index) => (
            <div key={index} className="mb-1">
              {line}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <span className="text-green-400">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            className="flex-1 bg-transparent text-green-400 placeholder-gray-500 outline-none"
            disabled={isRunning}
          />
          {isRunning && (
            <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          )}
        </form>
      </div>
    </div>
  );
}