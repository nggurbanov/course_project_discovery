import type { Project } from '../types/project.types';
import { ProjectCard } from './ProjectCard';
import { Skeleton } from './ui/skeleton';
import { Search, FileX } from 'lucide-react';
import { Button } from './ui/button';

interface ProjectListProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  loading?: boolean;
  isFavorite?: (projectId: string) => boolean;
  onToggleFavorite?: (projectId: string) => void;
}

export const ProjectList = ({ 
  projects, 
  onProjectClick, 
  loading = false,
  isFavorite,
  onToggleFavorite
}: ProjectListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gray-200 blur-2xl rounded-full opacity-50" />
          <div className="relative w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <FileX className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Проекты не найдены</h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          Попробуйте изменить фильтры или поисковый запрос, чтобы найти подходящие проекты
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <Search className="w-4 h-4 mr-2" />
          Сбросить фильтры
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onProjectClick(project)}
            isFavorite={isFavorite ? isFavorite(project.id) : false}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
