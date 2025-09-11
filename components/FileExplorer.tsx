import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { File, Plus, Folder, FileText, Trash2, Edit3 } from 'lucide-react';

export default function FileExplorer() {
  const { files, activeFile, setActiveFile, addFile, deleteFile } = useAppStore();
  const [showNewFileForm, setShowNewFileForm] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('javascript');

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;

    const extension = getExtensionFromType(newFileType);
    const fileName = newFileName.includes('.') ? newFileName : `${newFileName}.${extension}`;
    const path = `/${fileName}`;

    const newFile: File = {
      name: fileName,
      content: getDefaultContent(newFileType),
      language: newFileType,
      path,
    };

    addFile(newFile);
    setActiveFile(path);
    setNewFileName('');
    setShowNewFileForm(false);
  };

  const getExtensionFromType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'javascript': 'js',
      'typescript': 'ts',
      'html': 'html',
      'css': 'css',
      'python': 'py',
      'json': 'json',
      'markdown': 'md',
    };
    return typeMap[type] || 'js';
  };

  const getDefaultContent = (type: string) => {
    const contentMap: { [key: string]: string } = {
      'javascript': '// JavaScript file\nconsole.log("Hello, World!");',
      'typescript': '// TypeScript file\nconsole.log("Hello, World!");',
      'html': '<!DOCTYPE html>\n<html>\n<head>\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
      'css': '/* CSS file */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}',
      'python': '# Python file\nprint("Hello, World!")',
      'json': '{\n    "name": "project",\n    "version": "1.0.0"\n}',
      'markdown': '# Markdown file\n\nThis is a markdown file.',
    };
    return contentMap[type] || '// New file';
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconMap: { [key: string]: any } = {
      'js': FileText,
      'jsx': FileText,
      'ts': FileText,
      'tsx': FileText,
      'html': FileText,
      'css': FileText,
      'scss': FileText,
      'json': FileText,
      'md': FileText,
      'py': FileText,
      'php': FileText,
      'java': FileText,
      'cpp': FileText,
      'c': FileText,
      'go': FileText,
      'rs': FileText,
      'rb': FileText,
      'sh': FileText,
      'yml': FileText,
      'yaml': FileText,
      'xml': FileText,
    };
    return iconMap[ext || ''] || FileText;
  };

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Files</h3>
          <button
            onClick={() => setShowNewFileForm(!showNewFileForm)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="New file"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* New file form */}
      {showNewFileForm && (
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="File name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              autoFocus
            />
            <select
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="json">JSON</option>
              <option value="markdown">Markdown</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleCreateFile}
                className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewFileForm(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File list */}
      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No files yet</p>
            <p className="text-xs">Create a new file to get started</p>
          </div>
        ) : (
          <div className="p-2">
            {files.map((file) => {
              const Icon = getFileIcon(file.name);
              const isActive = activeFile === file.path;
              
              return (
                <div
                  key={file.path}
                  className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setActiveFile(file.path)}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement rename functionality
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Rename"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.path);
                        if (activeFile === file.path) {
                          setActiveFile(null);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}