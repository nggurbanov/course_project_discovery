import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectData } from '../hooks/useProjectData';
import { useFilters } from '../hooks/useFilters';
import { useFavorites } from '../hooks/useFavorites';
import { useScrollRestoration } from '../hooks/useScrollRestoration';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProjectList } from '../components/ProjectList';
// import { ConstellationMap } from '../components/ConstellationMap';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
// import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  // Map, 
  List, 
  Loader2, 
  AlertCircle,
} from 'lucide-react';
import type { Project, Supervisor } from '../types/project.types';

const VIEW_MODE_STORAGE_KEY = 'coursework_view_mode';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useProjectData();
  const { filters, filteredProjects, updateFilter, clearFilters } = useFilters(data?.projects || []);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // // Load saved view mode or default to 'list'
  // const [activeView, setActiveView] = useState<'list' | 'map'>(() => {
  //   try {
  //     const saved = sessionStorage.getItem(VIEW_MODE_STORAGE_KEY);
  //     return (saved as 'list' | 'map') || 'list';
  //   } catch {
  //     return 'list';
  //   }
  // });
  
  // Restore scroll position when returning to this page
  useScrollRestoration(!loading && !!data);

  // Apply homepage search filter if it exists
  useEffect(() => {
    if (!data) return;
    
    try {
      const savedFilter = sessionStorage.getItem('homepage_search_filter');
      if (savedFilter) {
        const filterData = JSON.parse(savedFilter);
        
        // Check if the filter is recent (within 30 seconds)
        const isRecent = Date.now() - filterData.timestamp < 30000;
        
        if (isRecent) {
          // Clear all existing filters first
          clearFilters();
          
          // Apply the appropriate filter based on type
          switch (filterData.type) {
            case 'supervisor':
              updateFilter('selectedSupervisor', filterData.value);
              break;
            case 'tag':
              updateFilter('selectedTags', [filterData.value]);
              break;
            case 'course':
              updateFilter('selectedCourses', [filterData.value]);
              break;
          }
          
          // Clear the saved filter so it doesn't apply again
          sessionStorage.removeItem('homepage_search_filter');
        }
      }
    } catch (error) {
      console.error('Error applying homepage search filter:', error);
    }
  }, [data, updateFilter, clearFilters]);

  // // Save view mode when it changes
  // const handleViewChange = (view: 'list' | 'map') => {
  //   setActiveView(view);
  //   try {
  //     sessionStorage.setItem(VIEW_MODE_STORAGE_KEY, view);
  //   } catch (error) {
  //     console.error('Error saving view mode:', error);
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-blue-600 relative" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Загружаем проекты...</h3>
          <p className="text-gray-600">Подготавливаем лучшие возможности для вас</p>
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

  const handleSupervisorClick = (supervisor: Supervisor) => {
    navigate(`/supervisors/${supervisor.id}`);
  };

  const filteredSupervisorIds = new Set(filteredProjects.map(p => p.supervisor));
  const filteredSupervisors = data.supervisors.filter(s => 
    s.projects.some(pId => filteredProjects.find(p => p.id === pId))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
                <SearchBar
                  value={filters.searchQuery}
                  onChange={(value) => updateFilter('searchQuery', value)}
                  placeholder="Поиск по названию, описанию, тегам..."
                  className="mb-6"
                />
              <FilterSidebar
                filters={filters}
                onFilterChange={updateFilter}
                projects={data.projects}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Toggle */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {filteredProjects.length === data.projects.length 
                    ? 'Все проекты' 
                    : `Найдено ${filteredProjects.length} ${
                        filteredProjects.length === 1 ? 'проект' : 
                        filteredProjects.length < 5 ? 'проекта' : 'проектов'
                      }`}
                </h2>
                <p className="text-sm text-gray-600">
                  {filters.searchQuery && `Результаты поиска: "${filters.searchQuery}"`}
                  {filters.selectedTags.length > 0 && (
                    <span className="ml-2 text-blue-600">
                      • Фильтр: {filters.selectedTags.length} {
                        filters.selectedTags.length === 1 ? 'тег' : 'тега'
                      }
                    </span>
                  )}
                </p>
              </div>
              
              {/* <Tabs value={activeView} onValueChange={(v: string) => handleViewChange(v as 'list' | 'map')} className="w-auto">
                <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
                  <TabsTrigger value="list" className="flex items-center space-x-2">
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">Список</span>
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center space-x-2">
                    <Map className="w-4 h-4" />
                    <span className="hidden sm:inline">Карта</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs> */}
            </div>

            {/* Content */}
            <div className="animate-in" key={`view-list-${filteredProjects.length}`}>
              {/* {activeView === 'list' ? ( */}
                <ProjectList
                  key={`list-${filteredProjects.length}-${filters.selectedTags.join(',')}`}
                  projects={filteredProjects}
                  onProjectClick={handleProjectClick}
                  loading={loading}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />
              {/* ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <ConstellationMap
                    projects={filteredProjects}
                    supervisors={filteredSupervisors}
                    onProjectClick={handleProjectClick}
                    onSupervisorClick={handleSupervisorClick}
                    width={800}
                    height={600}
                  />
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
