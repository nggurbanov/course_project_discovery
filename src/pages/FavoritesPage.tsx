import { useFavorites } from '../hooks/useFavorites';
import { useProjectData } from '../hooks/useProjectData';
import { useScrollRestoration } from '../hooks/useScrollRestoration';
import { Header } from '../components/Header';
import { ProjectList } from '../components/ProjectList';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Loader2, 
  AlertCircle, 
  Heart,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Project } from '../types/project.types';

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useProjectData();
  const { favorites, isFavorite, toggleFavorite, clearFavorites, favoritesCount } = useFavorites();
  
  // Restore scroll position when returning to this page
  useScrollRestoration(!loading && !!data);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-blue-600 relative" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Загружаем проекты...</h3>
          <p className="text-gray-600">Подготавливаем ваши избранные проекты</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600">{error || 'Не удалось загрузить данные'}</p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  // Filter projects to only show favorites
  const favoriteProjects = data.projects.filter(project => 
    favorites.includes(project.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-red-600 to-purple-600 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Link to="/" className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к каталогу
            </Link>

            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 fill-current" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black">
                    Избранные проекты
                  </h1>
                </div>
                
                <p className="text-xl text-pink-100 max-w-2xl">
                  Все проекты, которые вы добавили в избранное. Сохраняются в вашем браузере.
                </p>
              </div>

              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
                {favoritesCount} {favoritesCount === 1 ? 'проект' : favoritesCount < 5 ? 'проекта' : 'проектов'}
              </Badge>
            </div>

            {/* Clear favorites button */}
            {favoritesCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={() => {
                  if (confirm('Вы уверены, что хотите очистить все избранные проекты?')) {
                    clearFavorites();
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Очистить избранное
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {favoriteProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-pink-200 blur-2xl rounded-full opacity-50" />
              <div className="relative w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-pink-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Нет избранных проектов</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Добавьте проекты в избранное, нажав на иконку сердечка на карточке проекта
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться к каталогу
              </Link>
            </Button>
          </div>
        ) : (
          <ProjectList
            projects={favoriteProjects}
            onProjectClick={handleProjectClick}
            loading={loading}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </div>
    </div>
  );
};

