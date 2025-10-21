import type { Project } from '../types/project.types';
import { Users, ArrowRight, BookOpen, Heart } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (projectId: string) => void;
}

export const ProjectCard = ({ project, onClick, isFavorite = false, onToggleFavorite }: ProjectCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'программный':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'исследовательский':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getFormatColor = (format: string) => {
    switch (format.toLowerCase()) {
      case 'командный':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'индивидуальный':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(project.id);
    }
  };

  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-gray-200/60"
      onClick={onClick}
    >
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      
      <CardContent className="p-6">
        {/* Header with Avatar and Type */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 border-2 border-gray-200">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                {getInitials(project.supervisor)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {project.supervisor}
              </p>
              <p className="text-xs text-gray-500 flex items-center mt-0.5">
                <BookOpen className="w-3 h-3 mr-1" />
                {project.courses.length > 0 ? project.courses[0].replace(/^\d+ курс /, '') : 'Курс не указан'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="secondary" className={`${getTypeColor(project.type)} border whitespace-nowrap`}>
              {project.type}
            </Badge>
            {/* Favorite button */}
            {onToggleFavorite && (
              <button
                className={`rounded-full w-8 h-8 flex items-center justify-center transition-all shadow-sm border ${
                  isFavorite 
                    ? 'bg-pink-100 hover:bg-pink-200 text-pink-600 border-pink-200' 
                    : 'bg-white hover:bg-gray-50 text-gray-400 hover:text-pink-600 border-gray-200'
                }`}
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
              >
                <Heart 
                  className={`w-4 h-4 transition-all ${isFavorite ? 'fill-current' : ''}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {project.title_ru}
        </h3>

        {/* English Title */}
        {project.title_en && (
          <p className="text-xs text-gray-500 italic mb-3 line-clamp-1">
            {project.title_en}
          </p>
        )}
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {project.annotation}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full border border-blue-100/50 hover:border-blue-200 transition-colors"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-full border border-gray-200">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4" />
              <span>{project.team_size} человек</span>
            </div>
            <Badge variant="outline" className={`${getFormatColor(project.format)} text-xs`}>
              {project.format}
            </Badge>
          </div>
          
          {/* View button with arrow */}
          <div className="flex items-center space-x-1 text-sm font-medium text-blue-600 group-hover:text-blue-700">
            <span className="text-xs">Подробнее</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
