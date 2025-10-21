import * as React from 'react';
import type { FilterState, Project } from '../types/project.types';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Filter, X, User, BookOpen, Briefcase, Users, Tag, Search } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  projects: Project[];
  onClearFilters: () => void;
}

export const FilterSidebar = ({
  filters,
  onFilterChange,
  projects,
  onClearFilters,
}: FilterSidebarProps) => {
  const [supervisorSearch, setSupervisorSearch] = React.useState('');
  const [tagSearch, setTagSearch] = React.useState('');

  const getUniqueValues = (key: keyof Project) => {
    const values = projects.map(project => project[key]).flat().filter(Boolean);
    
    // Create a map to handle case-insensitive deduplication and normalization
    const valueMap = new Map<string, string>();
    
    values.forEach(value => {
      if (typeof value === 'string') {
        // Normalize the value: trim whitespace, normalize spaces, remove extra newlines
        const normalizedValue = value.trim().replace(/\s+/g, ' ').replace(/\n/g, ' ');
        const lowerValue = normalizedValue.toLowerCase();
        
        // Keep the first occurrence, preferring properly capitalized versions
        if (!valueMap.has(lowerValue)) {
          valueMap.set(lowerValue, normalizedValue);
        } else {
          // If we already have this value, prefer the properly capitalized version
          const existing = valueMap.get(lowerValue)!;
          if (normalizedValue[0] === normalizedValue[0].toUpperCase() && existing[0] !== existing[0].toUpperCase()) {
            valueMap.set(lowerValue, normalizedValue);
          }
        }
      }
    });
    
    return Array.from(valueMap.values()).sort();
  };

  const uniqueSupervisors = getUniqueValues('supervisor');
  const uniqueCourses = getUniqueValues('courses');
  const uniqueTypes = getUniqueValues('type');
  const uniqueFormats = getUniqueValues('format');
  const uniqueTags = getUniqueValues('tags');

  // Filter supervisors based on search
  const filteredSupervisors = uniqueSupervisors.filter(supervisor =>
    supervisor.toLowerCase().includes(supervisorSearch.toLowerCase())
  );

  // Filter tags based on search
  const filteredTags = uniqueTags.filter(tag =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const CheckboxGroup = ({ 
    options, 
    selectedValues, 
    onChange
  }: {
    options: string[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    icon?: React.ElementType;
  }) => (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);
        return (
          <div
            key={option}
            className={`flex items-center space-x-3 p-2.5 rounded-lg transition-colors cursor-pointer ${
              isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
            }`}
            onClick={() => {
              if (isSelected) {
                onChange(selectedValues.filter(v => v !== option));
              } else {
                onChange([...selectedValues, option]);
              }
            }}
          >
            <Checkbox
              id={option}
              checked={isSelected}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...selectedValues, option]);
                } else {
                  onChange(selectedValues.filter(v => v !== option));
                }
              }}
            />
            <Label
              htmlFor={option}
              className="text-sm text-gray-700 cursor-pointer flex-1 leading-tight"
            >
              {option}
            </Label>
          </div>
        );
      })}
    </div>
  );

  const activeFiltersCount = 
    (filters.selectedSupervisor ? 1 : 0) +
    filters.selectedCourses.length +
    filters.selectedTypes.length +
    filters.selectedFormats.length +
    filters.selectedTags.length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Filter className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Фильтры</h3>
              <p className="text-xs text-gray-500">Уточните поиск</p>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <Badge className="bg-blue-600 text-white hover:bg-blue-700">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        
        {/* Quick Filter Overview */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1.5 text-gray-600">
            <User className="w-3 h-3" />
            <span>Руководители</span>
          </div>
          <div className="flex items-center space-x-1.5 text-gray-600">
            <BookOpen className="w-3 h-3" />
            <span>Курсы</span>
          </div>
          <div className="flex items-center space-x-1.5 text-gray-600">
            <Briefcase className="w-3 h-3" />
            <span>Тип проекта</span>
          </div>
          <div className="flex items-center space-x-1.5 text-gray-600">
            <Users className="w-3 h-3" />
            <span>Формат</span>
          </div>
          <div className="flex items-center space-x-1.5 text-gray-600 col-span-2">
            <Tag className="w-3 h-3" />
            <span>Теги ({uniqueTags.length})</span>
          </div>
        </div>
      </div>
      
      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="p-4 bg-blue-50/50 border-b border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">Активные фильтры</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-3 h-3 mr-1" />
              Сбросить
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.selectedSupervisor && (
              <Badge variant="secondary" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                {filters.selectedSupervisor.split(' ').slice(0, 2).join(' ')}
              </Badge>
            )}
            {filters.selectedCourses.slice(0, 2).map((course, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1" />
                {course.replace(/^\d+ курс /, '')}
              </Badge>
            ))}
            {filters.selectedTypes.map((type, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Filters Accordion */}
      <div className="overflow-y-auto lg:h-[calc(100vh-320px)] scrollbar-thick">
        <Accordion type="multiple" defaultValue={['supervisors', 'courses', 'types', 'formats', 'tags']} className="w-full">
          <AccordionItem value="supervisors" className="border-b border-gray-200 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center justify-between flex-1">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900">Руководители</span>
                </div>
                <div className="flex items-center space-x-2">
                  {filters.selectedSupervisor && (
                    <Badge variant="secondary" className="text-xs">1</Badge>
                  )}
                  <span className="text-xs text-gray-400">({uniqueSupervisors.length})</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Поиск руководителя..."
                    value={supervisorSearch}
                    onChange={(e) => setSupervisorSearch(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
              </div>
              <CheckboxGroup
                options={filteredSupervisors}
                selectedValues={filters.selectedSupervisor ? [filters.selectedSupervisor] : []}
                onChange={(values) => onFilterChange('selectedSupervisor', values[0] || '')}
                icon={User}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="courses" className="border-b border-gray-200 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center justify-between flex-1">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900">Курсы</span>
                </div>
                <div className="flex items-center space-x-2">
                  {filters.selectedCourses.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filters.selectedCourses.length}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-400">({uniqueCourses.length})</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <CheckboxGroup
                options={uniqueCourses}
                selectedValues={filters.selectedCourses}
                onChange={(values) => onFilterChange('selectedCourses', values)}
                icon={BookOpen}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="types" className="border-b border-gray-200 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center justify-between flex-1">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900">Тип проекта</span>
                </div>
                <div className="flex items-center space-x-2">
                  {filters.selectedTypes.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filters.selectedTypes.length}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-400">({uniqueTypes.length})</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <CheckboxGroup
                options={uniqueTypes}
                selectedValues={filters.selectedTypes}
                onChange={(values) => onFilterChange('selectedTypes', values)}
                icon={Briefcase}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="formats" className="border-b border-gray-200 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center justify-between flex-1">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900">Формат</span>
                </div>
                <div className="flex items-center space-x-2">
                  {filters.selectedFormats.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filters.selectedFormats.length}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-400">({uniqueFormats.length})</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <CheckboxGroup
                options={uniqueFormats}
                selectedValues={filters.selectedFormats}
                onChange={(values) => onFilterChange('selectedFormats', values)}
                icon={Users}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tags" className="border-0 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center justify-between flex-1">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900">Теги</span>
                </div>
                <div className="flex items-center space-x-2">
                  {filters.selectedTags.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filters.selectedTags.length}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-400">({uniqueTags.length})</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Поиск по тегам..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                {filters.selectedTags.length > 0 && (
                  <p className="text-xs text-blue-600 mt-2 italic">
                    Показываем проекты со ВСЕМИ выбранными тегами (AND логика)
                  </p>
                )}
              </div>
              <CheckboxGroup
                options={filteredTags}
                selectedValues={filters.selectedTags}
                onChange={(values) => onFilterChange('selectedTags', values)}
                icon={Tag}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-2" />
            Очистить все фильтры
          </Button>
        </div>
      )}
    </div>
  );
};