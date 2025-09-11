import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import QuickAction from '@/components/QuickAction';
import { ArrowRight, Zap, Shield, Users, Sparkles, Code, Play } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                Build with
                <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent"> AI</span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Create full-stack applications in seconds with AI-powered code generation. 
                No setup, no configuration - just pure creativity.
              </p>
            </motion.div>

            {/* Quick Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <QuickAction onProjectCreate={handleProjectCreate} />
              {isCreating && (
                <div className="mt-4 text-sm text-gray-500 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                  Creating your project...
                </div>
              )}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
                <p className="text-gray-600">
                  Generate code instantly with advanced AI models. From simple components to complex applications.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Preview</h3>
                <p className="text-gray-600">
                  See your code come to life immediately with our integrated development environment.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Full-Stack Ready</h3>
                <p className="text-gray-600">
                  Build complete applications with frontend, backend, and database integration.
                </p>
              </div>
            </motion.div>
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