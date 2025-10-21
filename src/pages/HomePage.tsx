import { useNavigate } from 'react-router-dom';
import { useProjectData } from '../hooks/useProjectData';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { SearchSuggestions } from '../components/SearchSuggestions';
import { 
  Sparkles, 
  TrendingUp, 
  Users,
  BookOpen,
  Zap,
  ArrowRight
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const { data } = useProjectData();

  const handleGoToProjects = () => {
    navigate('/projects');
  };

  // Handle search suggestion selection
  const handleSearchSelect = (type: string, value: string) => {
    // Save the filter to sessionStorage
    const filterData = {
      type,
      value,
      timestamp: Date.now()
    };
    sessionStorage.setItem('homepage_search_filter', JSON.stringify(filterData));
    
    // Navigate to projects page
    navigate('/projects');
  };
  
  const totalProjects = data?.metadata?.total_projects ?? '...';
  const totalSupervisors = data?.metadata?.total_supervisors ?? '...';
  const totalTags = data?.metadata?.total_tags ?? '...';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {data && (
              <Badge className="mb-6 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                {totalProjects} проектов доступно
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Найдите идеальный проект
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200">
                для вашей курсовой работы
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Исследуйте сотни проектов от ведущих преподавателей. Фильтруйте по темам, руководителям и форматам.
            </p>

            {/* Search Suggestions */}
            <div className="max-w-2xl mx-auto mb-8">
              {data && (
                <SearchSuggestions
                  projects={data.projects}
                  onSelect={handleSearchSelect}
                />
              )}
            </div>
            
            <Button 
              size="lg" 
              className="group bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out animate-pulse-slow text-lg font-bold py-8 px-10" 
              onClick={handleGoToProjects}
            >
              Перейти ко всем проектам
              <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1.5" />
            </Button>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{totalProjects}</div>
                <div className="text-xs md:text-sm text-blue-100">Проектов</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{totalSupervisors}</div>
                <div className="text-xs md:text-sm text-blue-100">Руководителей</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{totalTags}</div>
                <div className="text-xs md:text-sm text-blue-100">Тем</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">Растем</div>
                <div className="text-xs md:text-sm text-blue-100">С каждым днем</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
