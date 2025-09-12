import Link from 'next/link';
import { Project } from '@/types';
import { Calendar, Eye, Edit } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-1 ml-4">
          {project.isPublic && (
            <div className="flex items-center text-green-600 text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Public
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDate(project.updatedAt)}
        </div>
        
        <div className="flex items-center space-x-2">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}