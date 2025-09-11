import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useAppStore } from '@/lib/store';
import { File } from '@/types';

interface CodeEditorProps {
  file: File;
  onContentChange?: (content: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ file, onContentChange, readOnly = false }: CodeEditorProps) {
  const { updateFile, theme } = useAppStore();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 1.5,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Auto-save functionality
      if (onContentChange) {
        onContentChange(editor.getValue());
      }
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFile(file.path, value);
      if (onContentChange) {
        onContentChange(value);
      }
    }
  };

  const getLanguageFromExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'sql': 'sql',
      'php': 'php',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'go': 'go',
      'rs': 'rust',
      'rb': 'ruby',
      'sh': 'shell',
      'yml': 'yaml',
      'yaml': 'yaml',
      'xml': 'xml',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={getLanguageFromExtension(file.name)}
        value={file.content}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          readOnly,
          selectOnLineNumbers: true,
          roundedSelection: false,
          cursorStyle: 'line',
          automaticLayout: true,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          wordBasedSuggestions: 'off',
          parameterHints: {
            enabled: true,
          },
          hover: {
            enabled: true,
          },
          contextmenu: true,
          mouseWheelZoom: true,
          smoothScrolling: true,
        }}
      />
    </div>
  );
}