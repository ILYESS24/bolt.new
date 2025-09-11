import { useState } from 'react';
import { useRouter } from 'next/router';
import { Plus, FileText, Code, Palette, Database } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Input */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What would you like to create today?"
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 top-2 bottom-2 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-5 h-5" />
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