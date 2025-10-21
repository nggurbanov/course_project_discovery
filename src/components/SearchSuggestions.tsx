import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Tag, BookOpen } from 'lucide-react';
import type { Project } from '../types/project.types';

interface SearchSuggestionsProps {
  projects: Project[];
  onSelect: (type: string, value: string) => void;
}

interface Suggestion {
  type: 'supervisor' | 'tag' | 'course';
  value: string;
  label: string;
  icon: React.ReactNode;
}

export const SearchSuggestions = ({ projects, onSelect }: SearchSuggestionsProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Generate suggestions based on query
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const queryLower = query.toLowerCase();
    const newSuggestions: Suggestion[] = [];

    // Search supervisors
    const supervisors = Array.from(new Set(projects.map(p => p.supervisor)))
      .filter(supervisor => supervisor.toLowerCase().includes(queryLower))
      .slice(0, 3)
      .map(supervisor => ({
        type: 'supervisor' as const,
        value: supervisor,
        label: supervisor,
        icon: <User className="w-4 h-4" />
      }));

    // Search tags
    const allTags = Array.from(new Set(projects.flatMap(p => p.tags)))
      .filter(tag => tag.toLowerCase().includes(queryLower))
      .slice(0, 3)
      .map(tag => ({
        type: 'tag' as const,
        value: tag,
        label: tag,
        icon: <Tag className="w-4 h-4" />
      }));

    // Search courses
    const allCourses = Array.from(new Set(projects.flatMap(p => p.courses)))
      .filter(course => course.toLowerCase().includes(queryLower))
      .slice(0, 3)
      .map(course => ({
        type: 'course' as const,
        value: course,
        label: course,
        icon: <BookOpen className="w-4 h-4" />
      }));

    newSuggestions.push(...supervisors, ...allTags, ...allCourses);
    setSuggestions(newSuggestions.slice(0, 6)); // Limit to 6 suggestions
    setShowSuggestions(newSuggestions.length > 0);
    setSelectedIndex(-1);
  }, [query, projects]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const suggestion = suggestions[selectedIndex];
          onSelect(suggestion.type, suggestion.value);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: Suggestion) => {
    onSelect(suggestion.type, suggestion.value);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 150);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Начните поиск по названию, описанию, тегам..."
          className="w-full pl-12 pr-4 py-4 text-lg border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent bg-white/20 backdrop-blur-sm text-white placeholder-white/70"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.value}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors ${
                index === selectedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              } ${index === 0 ? 'rounded-t-xl' : ''} ${
                index === suggestions.length - 1 ? 'rounded-b-xl' : 'border-b border-gray-100'
              }`}
            >
              <div className="text-gray-400">
                {suggestion.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium">{suggestion.label}</div>
                <div className="text-sm text-gray-500 capitalize">
                  {suggestion.type === 'supervisor' && 'Руководитель'}
                  {suggestion.type === 'tag' && 'Тег'}
                  {suggestion.type === 'course' && 'Курс'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
