import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProjectRedirect() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // Redirect to the editor
      router.replace(`/editor/${id}`);
    }
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to editor...</p>
      </div>
    </div>
  );
}