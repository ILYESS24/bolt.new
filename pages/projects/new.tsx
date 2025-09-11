import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Save, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function NewProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState({
    title: '',
    description: '',
    content: '',
    isPublic: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    // Pre-fill from URL parameters
    if (router.query.title) {
      setProject(prev => ({ ...prev, title: router.query.title as string }));
    }
    if (router.query.type) {
      const type = router.query.type as string;
      setProject(prev => ({ 
        ...prev, 
        description: `A new ${type} project`,
        content: getDefaultContent(type, router.query.title as string || 'Untitled')
      }));
    }
  }, [router.query]);

  const getDefaultContent = (type: string, title: string) => {
    switch (type) {
      case 'document':
        return `# ${title}\n\nStart writing your document here...\n\n## Introduction\n\n## Main Content\n\n## Conclusion`;
      case 'code':
        return `// ${title}\n\n// Start coding here...\n\nfunction main() {\n  console.log("Hello, World!");\n}\n\nmain();`;
      case 'design':
        return `# ${title}\n\n## Design Brief\n\nDescribe your design project here...\n\n## Goals\n- \n- \n- \n\n## Wireframes\n\n## Mockups\n\n## Final Design`;
      case 'data':
        return `# ${title}\n\n## Data Analysis Project\n\n### Dataset\nDescribe your dataset here...\n\n### Analysis\nStart your analysis here...\n\n### Results\n\n### Conclusions`;
      default:
        return `# ${title}\n\nStart your project here...`;
    }
  };

  const handleSave = async () => {
    if (!project.title.trim()) {
      alert('Please enter a title for your project');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        const newProject = await response.json();
        router.push(`/projects/${newProject.id}`);
      } else {
        console.error('Failed to create project');
        alert('Failed to create project. Please try again.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
              <p className="text-gray-600">Start building something amazing</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setProject(prev => ({ ...prev, isPublic: !prev.isPublic }))}
              className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
                project.isPublic
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            >
              {project.isPublic ? (
                <Eye className="w-4 h-4 mr-2" />
              ) : (
                <EyeOff className="w-4 h-4 mr-2" />
              )}
              {project.isPublic ? 'Public' : 'Private'}
            </button>
            
            <button
              onClick={handleSave}
              disabled={loading || !project.title.trim()}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              value={project.title}
              onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your project title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={project.description}
              onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={project.content}
              onChange={(e) => setProject(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Start writing your project content..."
              rows={20}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}