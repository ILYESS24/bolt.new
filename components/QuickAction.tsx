import { useState } from 'react';
import { useRouter } from 'next/router';
import { Plus, FileText, Code, Palette, Database, Sparkles } from 'lucide-react';

interface QuickActionProps {
  onProjectCreate?: (title: string, type: string) => void;
}

export default function QuickAction({ onProjectCreate }: QuickActionProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedType, setSelectedType] = useState('document');
  const router = useRouter();

  const projectTypes = [
    { id: 'document', label: 'Document', icon: FileText, description: 'Create a text document' },
    { id: 'code', label: 'Code Project', icon: Code, description: 'Start a coding project' },
    { id: 'design', label: 'Design', icon: Palette, description: 'Create a design project' },
    { id: 'data', label: 'Data Project', icon: Database, description: 'Work with data' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (onProjectCreate) {
      onProjectCreate(inputValue.trim(), selectedType);
    } else {
      // Default behavior: navigate to create project
      router.push(`/projects/new?title=${encodeURIComponent(inputValue.trim())}&type=${selectedType}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Input */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Create a React todo app with TypeScript and Tailwind CSS"
            className="w-full px-6 py-5 text-xl border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-white shadow-lg"
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-3 top-3 bottom-3 px-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Create</span>
            </div>
          </button>
        </div>

        {/* Project Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {projectTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedType === type.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${
                  selectedType === type.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <div className="text-sm font-medium text-gray-900">{type.label}</div>
                <div className="text-xs text-gray-500 mt-1">{type.description}</div>
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
}