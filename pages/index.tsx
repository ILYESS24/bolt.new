import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import QuickAction from '@/components/QuickAction';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleProjectCreate = async (title: string, type: string) => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: `A new ${type} project`,
          content: getDefaultContent(type),
          isPublic: false,
        }),
      });

      if (response.ok) {
        const project = await response.json();
        router.push(`/projects/${project.id}`);
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'document':
        return '# ' + title + '\n\nStart writing your document here...';
      case 'code':
        return '// ' + title + '\n\n// Start coding here...\n\nfunction main() {\n  console.log("Hello, World!");\n}\n\nmain();';
      case 'design':
        return '# ' + title + '\n\n## Design Brief\n\nDescribe your design project here...\n\n## Goals\n- \n- \n- ';
      case 'data':
        return '# ' + title + '\n\n## Data Analysis Project\n\n### Dataset\nDescribe your dataset here...\n\n### Analysis\nStart your analysis here...';
      default:
        return '# ' + title + '\n\nStart your project here...';
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create, Build, and
              <span className="text-primary-600"> Share</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              A modern platform for creating and managing your projects. 
              Build anything from documents to code projects with ease.
            </p>

            {/* Quick Action */}
            <div className="mb-16">
              <QuickAction onProjectCreate={handleProjectCreate} />
              {isCreating && (
                <div className="mt-4 text-sm text-gray-500">
                  Creating your project...
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">
                  Create and edit projects instantly with our optimized interface.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">
                  Your projects are secure with optional public sharing capabilities.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaborative</h3>
                <p className="text-gray-600">
                  Share your projects and collaborate with others seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!session && (
        <div className="bg-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Sign in to save your projects and access your dashboard.
              </p>
              <button
                onClick={() => router.push('/api/auth/signin')}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}