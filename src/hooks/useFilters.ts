import { useState, useMemo, useEffect } from 'react';
import type { Project, FilterState } from '../types/project.types';

const FILTERS_STORAGE_KEY = 'coursework_filters';

const initialFilterState: FilterState = {
  searchQuery: '',
  selectedSupervisor: '',
  selectedCourses: [],
  selectedTypes: [],
  selectedFormats: [],
  selectedTags: [],
};

// Load filters from sessionStorage
const loadSavedFilters = (): FilterState => {
  try {
    const saved = sessionStorage.getItem(FILTERS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading saved filters:', error);
  }
  return initialFilterState;
};

export const useFilters = (projects: Project[]) => {
  const [filters, setFilters] = useState<FilterState>(loadSavedFilters);

  // Save filters to sessionStorage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  }, [filters]);

  const filteredProjects = useMemo(() => {
    const result = projects.filter((project) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          project.title_ru.toLowerCase().includes(query) ||
          project.title_en.toLowerCase().includes(query) ||
          project.annotation.toLowerCase().includes(query) ||
          project.supervisor.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Supervisor filter
      if (filters.selectedSupervisor && project.supervisor !== filters.selectedSupervisor) {
        return false;
      }

      // Course filter
      if (filters.selectedCourses.length > 0) {
        const hasMatchingCourse = filters.selectedCourses.some(course => 
          project.courses.includes(course)
        );
        if (!hasMatchingCourse) return false;
      }

      // Type filter (case-insensitive with normalization)
      if (filters.selectedTypes.length > 0) {
        const normalizedProjectType = project.type.trim().replace(/\s+/g, ' ').replace(/\n/g, ' ');
        const hasMatchingType = filters.selectedTypes.some(type => {
          const normalizedType = type.trim().replace(/\s+/g, ' ').replace(/\n/g, ' ');
          return normalizedType.toLowerCase() === normalizedProjectType.toLowerCase();
        });
        if (!hasMatchingType) return false;
      }

      // Format filter (case-insensitive with normalization)
      if (filters.selectedFormats.length > 0) {
        const normalizedProjectFormat = project.format.trim().replace(/\s+/g, ' ').replace(/\n/g, ' ');
        const hasMatchingFormat = filters.selectedFormats.some(format => {
          const normalizedFormat = format.trim().replace(/\s+/g, ' ').replace(/\n/g, ' ');
          return normalizedFormat.toLowerCase() === normalizedProjectFormat.toLowerCase();
        });
        if (!hasMatchingFormat) return false;
      }

      // Tags filter - use AND logic (intersection)
      if (filters.selectedTags.length > 0) {
        const hasAllTags = filters.selectedTags.every(tag => 
          project.tags.includes(tag)
        );
        if (!hasAllTags) return false;
      }

      return true;
    });

    // Debug logging
    if (filters.selectedTags.length > 0) {
      console.log('🏷️ Tag Filter Debug:', {
        selectedTags: filters.selectedTags,
        totalProjects: projects.length,
        filteredCount: result.length,
        sampleProject: result[0] ? {
          title: result[0].title_ru,
          tags: result[0].tags
        } : 'No projects found'
      });
    }

    return result;
  }, [projects, filters]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilterState);
    sessionStorage.removeItem(FILTERS_STORAGE_KEY);
  };

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

  return {
    filters,
    filteredProjects,
    updateFilter,
    clearFilters,
    getUniqueValues,
  };
};
