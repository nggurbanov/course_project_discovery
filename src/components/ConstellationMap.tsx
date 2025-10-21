// DISABLED: Graph functionality temporarily disabled for performance
// This component is kept for future re-enablement but all calculations are disabled

import { useEffect, useRef } from 'react';
// import * as d3 from 'd3'; // DISABLED: D3.js removed to improve performance
import type { Project, Supervisor } from '../types/project.types';
// import { Button } from './ui/button'; // DISABLED: No longer needed
// import { Home, Tags, Users } from 'lucide-react'; // DISABLED: No longer needed

// DISABLED: Helper function for D3 text wrapping - no longer needed
// function wrapText(selection: d3.Selection<SVGTextElement, GraphNode, SVGGElement, unknown>, width: number) { ... }

interface ConstellationMapProps {
  projects: Project[];
  supervisors: Supervisor[];
  onProjectClick: (project: Project) => void;
  onSupervisorClick: (supervisor: Supervisor) => void;
  width?: number;
  height?: number;
}

// DISABLED: Graph-related interfaces no longer needed
// interface GraphNode { ... }
// interface GraphLink { ... }
// interface TooltipData { ... }

export const ConstellationMap = ({
  projects,
  supervisors,
  onProjectClick,
  onSupervisorClick,
  width = 800,
  height = 600
}: ConstellationMapProps) => {
  // DISABLED: Graph functionality temporarily disabled for performance
  // All D3 calculations and force simulations are disabled
  
  const svgRef = useRef<SVGSVGElement>(null);
  // DISABLED: All state variables for graph interactions are disabled
  // const [viewMode, setViewMode] = useState<'overview' | 'supervisor' | 'tags' | 'tag_centric'>('overview');
  // const [selectedSupervisorId, setSelectedSupervisorId] = useState<string | null>(null);
  // const [selectedTag, setSelectedTag] = useState<string | null>(null);
  // const [tooltip, setTooltip] = useState<TooltipData>({ title: '', description: '', x: 0, y: 0, visible: false });

  // DISABLED: Helper function no longer needed
  // const shortenName = (name: string) => { ... }

  useEffect(() => {
    // DISABLED: All D3 calculations and force simulations are disabled for performance
    // This prevents heavy background calculations from running
    
    if (!svgRef.current) return;

    const svg = svgRef.current;
    svg.innerHTML = ''; // Clear any existing content

    // Create a simple disabled message instead of complex graph
    const disabledMessage = document.createElement('div');
    disabledMessage.className = 'flex flex-col items-center justify-center h-full text-center p-8';
    disabledMessage.innerHTML = `
      <div class="text-gray-500 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Карта проектов временно отключена</h3>
        <p class="text-sm text-gray-500 max-w-md">
          Интерактивная карта проектов временно недоступна для улучшения производительности. 
          Используйте список проектов для поиска и фильтрации.
        </p>
      </div>
    `;
    
    svg.appendChild(disabledMessage);

    // No cleanup needed since we're not running simulations
    return () => {
      // No D3 simulations to stop
    };
  }, [projects, supervisors, onProjectClick, onSupervisorClick, width, height]);

    // All D3 calculations and force simulations are disabled for performance
    // The component now shows a simple disabled message instead

  // DISABLED: Reset function no longer needed
  // const handleReset = () => { ... }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Карта проектов</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-4 text-sm text-gray-600 border-l pl-4 ml-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              Временно отключено
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="border border-gray-200 rounded"
        />
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>• Интерактивная карта проектов временно недоступна для улучшения производительности.</p>
        <p>• Используйте список проектов для поиска и фильтрации.</p>
        <p>• Функция будет восстановлена в будущих обновлениях.</p>
      </div>
    </div>
  );
};
