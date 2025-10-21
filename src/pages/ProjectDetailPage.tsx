import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProjectData } from '../hooks/useProjectData';
import { useFavorites } from '../hooks/useFavorites';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  ArrowLeft,
  User,
  Users,
  Briefcase,
  Target,
  CheckSquare,
  FileText,
  Mail,
  Video,
  Presentation,
  ExternalLink,
  BookOpen,
  UserCheck,
  Loader2,
  AlertCircle,
  Share2,
  Heart,
  ChevronRight
} from 'lucide-react';

export const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, loading, error } = useProjectData();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Загрузка проекта...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
            <p className="text-gray-600">{error || 'Не удалось загрузить данные'}</p>
          </div>
        </div>
      </div>
    );
  }

  const project = data.projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
            <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Проект не найден</h2>
            <p className="text-gray-600 mb-6">Запрашиваемый проект не существует</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к списку
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
      <Header />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">
              Главная
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Детали проекта</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6 -ml-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к списку
          </Button>

          {/* Hero Card */}
          <Card className="mb-6 overflow-hidden border-none shadow-xl">
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 px-8 py-10 text-white">
              <div className="absolute inset-0 bg-grid-white/10" />
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-14 w-14 border-2 border-white shadow-lg">
                      <AvatarFallback className="bg-white text-blue-600 text-lg font-bold">
                        {getInitials(project.supervisor)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="w-4 h-4" />
                        <span className="font-semibold">{project.supervisor}</span>
                      </div>
                      {project.co_supervisor && (
                        <div className="flex items-center space-x-2 text-sm text-blue-100">
                          <User className="w-3 h-3" />
                          <span>Соруководитель: {project.co_supervisor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: project.title_ru,
                            text: project.annotation,
                            url: window.location.href
                          });
                        }
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className={`border-white/30 transition-all ${
                        isFavorite(project.id)
                          ? 'bg-pink-500 hover:bg-pink-600 text-white'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                      onClick={() => toggleFavorite(project.id)}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(project.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
                  {project.title_ru}
                </h1>
                {project.title_en && (
                  <p className="text-lg text-blue-100 italic mb-4">{project.title_en}</p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Info Bar */}
            <CardContent className="p-6 bg-gradient-to-r from-gray-50 to-gray-100/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Тип</div>
                    <div className="text-sm font-semibold text-gray-900">{project.type}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Формат</div>
                    <div className="text-sm font-semibold text-gray-900">{project.format}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Команда</div>
                    <div className="text-sm font-semibold text-gray-900">{project.team_size} чел.</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <UserCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Отбор</div>
                    <div className="text-sm font-semibold text-gray-900">{project.selection_form}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Annotation */}
              {project.annotation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span>Аннотация</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{project.annotation}</p>
                  </CardContent>
                </Card>
              )}

              {/* Goals */}
              {project.goals && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="w-5 h-5 text-purple-600" />
                      </div>
                      <span>Цель проекта</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{project.goals}</p>
                  </CardContent>
                </Card>
              )}

              {/* Tasks */}
              {project.tasks && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span>Задачи проекта</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {project.tasks}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Requirements */}
              {project.requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <UserCheck className="w-5 h-5 text-amber-600" />
                      </div>
                      <span>Требования к студентам</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {project.requirements}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Courses */}
              {project.courses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span>Курсы</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {project.courses.map((course, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100/50"
                      >
                        <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{course}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Contact */}
              {(project.contact || project.preferred_contact) && (
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span>Контакты</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {project.contact && (
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Email</div>
                        <a
                          href={`mailto:${project.contact}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium break-all"
                        >
                          {project.contact}
                        </a>
                      </div>
                    )}
                    {project.preferred_contact && (
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Предпочтительный способ</div>
                        <p className="text-sm text-gray-700 font-medium">{project.preferred_contact}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Materials */}
              {(project.video_link || project.presentation_link) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Материалы</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {project.video_link && (
                      <a
                        href={project.video_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center space-x-2">
                          <Video className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-gray-700">Видео проекта</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </a>
                    )}
                    {project.presentation_link && (
                      <a
                        href={project.presentation_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center space-x-2">
                          <Presentation className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium text-gray-700">Презентация</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
