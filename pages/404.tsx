import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Home, ArrowLeft } from 'lucide-react';

export default function Custom404() {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary-600">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mt-4">Page not found</h2>
            <p className="text-gray-600 mt-2">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </button>
            
            <div>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}