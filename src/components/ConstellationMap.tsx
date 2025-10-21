import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Project, Supervisor } from '../types/project.types';
import { Button } from './ui/button';
import { Home, Tags, Users } from 'lucide-react';

// Helper function to wrap text
function wrapText(selection: d3.Selection<SVGTextElement, GraphNode, SVGGElement, unknown>, width: number) {
  selection.each(function (d) {
    const textElement = d3.select(this);
    const words = (d.name || '').split(/\s+/).reverse();
    let word;
    let line: string[] = [];
    let lineNumber = 0;
    const lineHeight = 1.1; // ems
    const y = textElement.attr("y");
    const dy = parseFloat(textElement.attr("dy"));
    let tspan = textElement.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node()!.getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = textElement.append("tspan").attr("x", 0).attr("y", y).attr("dy", (++lineNumber * lineHeight) + dy + "em").text(word);
      }
    }
  });
}

interface ConstellationMapProps {
  projects: Project[];
  supervisors: Supervisor[];
  onProjectClick: (project: Project) => void;
  onSupervisorClick: (supervisor: Supervisor) => void;
  width?: number;
  height?: number;
}

interface GraphNode {
  id: string;
  type: 'supervisor' | 'project' | 'tag';
  name: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'supervisor-project' | 'project-tag';
}

interface TooltipData {
  title: string;
  description: string;
  details?: string;
  x: number;
  y: number;
  visible: boolean;
}

export const ConstellationMap = ({
  projects,
  supervisors,
  onProjectClick,
  onSupervisorClick,
  width = 800,
  height = 600
}: ConstellationMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'supervisor' | 'tags' | 'tag_centric'>('overview');
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({ title: '', description: '', x: 0, y: 0, visible: false });

  const shortenName = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0]} ${parts[1][0]}. ${parts.length > 2 ? parts[2][0] + '.' : ''}`;
    }
    return name;
  };

  useEffect(() => {
    if (!svgRef.current || projects.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    let simulation: d3.Simulation<GraphNode, any> | null = null;

    if (viewMode === 'overview') {
      // OVERVIEW MODE: Show all supervisors in a circle
      const supervisorNodes: GraphNode[] = supervisors.map(s => ({
        id: s.id,
        type: 'supervisor',
        name: s.name,
      }));

      const angleStep = (2 * Math.PI) / supervisorNodes.length;
      const radius = Math.min(width, height) / 3;

      supervisorNodes.forEach((node, i) => {
        node.x = width / 2 + radius * Math.cos(i * angleStep);
        node.y = height / 2 + radius * Math.sin(i * angleStep);
      });

      g.append("g")
        .selectAll("circle")
        .data(supervisorNodes)
        .enter().append("circle")
        .attr("r", 15)
        .attr("fill", "#3b82f6")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!)
        .style("cursor", "pointer")
        .on("click", (event, d) => {
          event.stopPropagation();
          setSelectedSupervisorId(d.id);
          setViewMode('supervisor');
        })
        .on("mouseover", function (event, d) {
          d3.select(this).attr('r', 20);
          const supervisor = supervisors.find(s => s.id === d.id);
          setTooltip({
            title: d.name,
            description: `Проектов: ${supervisor?.projects.length || 0}`,
            x: event.pageX,
            y: event.pageY,
            visible: true,
          });
        })
        .on("mouseout", function () {
          d3.select(this).attr('r', 15);
          setTooltip(t => ({ ...t, visible: false }));
        });

      g.append("g")
        .selectAll("text")
        .data(supervisorNodes)
        .enter().append("text")
        .text(d => shortenName(d.name))
        .attr("x", d => d.x!)
        .attr("y", d => d.y! + 25)
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("fill", "#1f2937")
        .attr("text-anchor", "middle");

    } else if (viewMode === 'supervisor' && selectedSupervisorId) {
      // SUPERVISOR-CENTRIC VIEW
      const selectedSupervisor = supervisors.find(s => s.id === selectedSupervisorId);
      if (!selectedSupervisor) return;

      const supervisorNode: GraphNode = {
        id: selectedSupervisor.id,
        type: 'supervisor',
        name: selectedSupervisor.name,
        fx: width / 2,
        fy: height / 2,
      };

      const projectNodes: GraphNode[] = selectedSupervisor.projects
        .map(pId => projects.find(p => p.id === pId))
        .filter((p): p is Project => !!p)
        .map(p => ({
          id: p.id,
          type: 'project',
          name: p.title_ru,
        }));

      const nodes: GraphNode[] = [supervisorNode, ...projectNodes];
      const links: GraphLink[] = projectNodes.map(pNode => ({
        source: supervisorNode.id,
        target: pNode.id,
        type: 'supervisor-project',
      }));

      simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => (d as any).id).distance(100))
        .force("charge", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(30));

      const link = g.append("g")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke", "#9ca3af")
        .attr("stroke-width", 1.5);
      
      const node = g.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", d => d.type === 'supervisor' ? 25 : 15)
        .attr("fill", d => d.type === 'supervisor' ? "#3b82f6" : "#8b5cf6")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("click", (event, d) => {
          event.stopPropagation();
          if (d.type === 'project') {
            const project = projects.find(p => p.id === d.id);
            if (project) onProjectClick(project);
          }
        })
        .on("mouseover", function (event, d) {
          d3.select(this).attr('r', d.type === 'supervisor' ? 30 : 20);
          d3.select(`#label-${d.id.replace(/[^a-zA-Z0-9-_]/g, '_')}`).style("opacity", 1);

          let title = d.name;
          let description = '';
          let details = '';

          if (d.type === 'project') {
            const project = projects.find(p => p.id === d.id);
            if (project) {
              title = project.title_ru;
              description = project.annotation.slice(0, 150) + (project.annotation.length > 150 ? '...' : '');
              const supervisor = supervisors.find(s => s.projects.includes(project.id));
              details = `Руководитель: ${supervisor?.name || 'N/A'}`;
            }
          } else if (d.type === 'supervisor') {
            const supervisor = supervisors.find(s => s.id === d.id);
            description = `Проектов: ${supervisor?.projects.length || 0}`;
          }

          setTooltip({
            title,
            description,
            details,
            x: event.pageX,
            y: event.pageY,
            visible: true,
          });
        })
        .on("mouseout", function (_event, d) {
          d3.select(this).attr('r', d.type === 'supervisor' ? 25 : 15);
          d3.select(`#label-${d.id.replace(/[^a-zA-Z0-9-_]/g, '_')}`).style("opacity", d.type === 'project' ? 0 : 1);
          setTooltip(t => ({ ...t, visible: false }));
        });
        
        const labels = g.append("g")
          .selectAll("text")
          .data(nodes)
          .enter().append("text")
          .attr("id", d => `label-${d.id.replace(/[^a-zA-Z0-9-_]/g, '_')}`)
          .text(d => d.type === 'supervisor' ? d.name : d.name)
          .style("opacity", d => d.type === 'project' ? 0 : 1)
          .attr("font-size", d => d.type === 'supervisor' ? '16px' : '10px')
          .attr("font-weight", "bold")
          .attr("fill", "#1f2937")
          .attr("text-anchor", "middle")
          .attr("dy", d => d.type === 'supervisor' ? 35 : 25)
          .call(wrapText, 150);
        
      simulation.on("tick", () => {
        link
          .attr("x1", d => (d.source as any).x)
          .attr("y1", d => (d.source as any).y)
          .attr("x2", d => (d.target as any).x)
          .attr("y2", d => (d.target as any).y);

        node
          .attr("cx", d => d.x!)
          .attr("cy", d => d.y!);
        
        labels
          .attr("transform", d => `translate(${d.x}, ${d.y})`);
      });
    } else if (viewMode === 'tags') {
      // TAG GALAXY VIEW
      const allTags = [...new Set(projects.flatMap(p => p.tags))];
      const tagNodes: GraphNode[] = allTags.map(tag => ({
        id: `tag_${tag}`,
        type: 'tag',
        name: tag
      }));

      const tagLinks: GraphLink[] = [];
      const projectTags = projects.map(p => p.tags);
      for (let i = 0; i < allTags.length; i++) {
        for (let j = i + 1; j < allTags.length; j++) {
          const tagA = allTags[i];
          const tagB = allTags[j];
          const sharedProjects = projectTags.filter(tags => tags.includes(tagA) && tags.includes(tagB)).length;
          if (sharedProjects > 0) {
            tagLinks.push({
              source: `tag_${tagA}`,
              target: `tag_${tagB}`,
              type: 'project-tag'
            });
          }
        }
      }

      simulation = d3.forceSimulation(tagNodes)
        .force("link", d3.forceLink(tagLinks).id(d => (d as any).id).strength(0.05))
        .force("charge", d3.forceManyBody().strength(-150))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(30));

      const node = g.append("g")
        .selectAll("circle")
        .data(tagNodes)
        .enter().append("circle")
        .attr("r", 10)
        .attr("fill", "#10b981")
        .style("cursor", "pointer")
        .on("click", (_event, d) => {
          setSelectedTag(d.name);
          setViewMode('tag_centric');
        })
        .on("mouseover", function (event, d) {
          d3.select(this).attr('r', 15);
          const projectCount = projects.filter(p => p.tags.includes(d.name)).length;
          setTooltip({
            title: d.name,
            description: `Проектов: ${projectCount}`,
            x: event.pageX,
            y: event.pageY,
            visible: true,
          });
        })
        .on("mouseout", function () {
          d3.select(this).attr('r', 10);
          setTooltip(t => ({ ...t, visible: false }));
        });

      const labels = g.append("g")
        .selectAll("text")
        .data(tagNodes)
        .enter().append("text")
        .text(d => d.name)
        .attr("font-size", "10px")
        .attr("text-anchor", "middle");

      simulation.on("tick", () => {
        node
          .attr("cx", d => d.x!)
          .attr("cy", d => d.y!);
        labels
          .attr("x", d => d.x!)
          .attr("y", d => d.y! + 20);
      });
    } else if (viewMode === 'tag_centric' && selectedTag) {
      // TAG-CENTRIC VIEW
      const tagNode: GraphNode = {
        id: `tag_${selectedTag}`,
        type: 'tag',
        name: selectedTag,
        fx: width / 2,
        fy: height / 2
      };

      const projectNodes: GraphNode[] = projects
        .filter(p => p.tags.includes(selectedTag))
        .map(p => ({
          id: p.id,
          type: 'project',
          name: p.title_ru,
        }));

      const nodes: GraphNode[] = [tagNode, ...projectNodes];
      const links = projectNodes.map(pNode => ({
        source: tagNode.id,
        target: pNode.id,
        type: 'project-tag'
      }));

      simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => (d as any).id).distance(120))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(25));

      const link = g.append("g")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke", "#9ca3af")
        .attr("stroke-width", 1.5);
      
      const node = g.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", d => d.type === 'tag' ? 25 : 15)
        .attr("fill", d => d.type === 'tag' ? "#10b981" : "#8b5cf6")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("click", (_event, d) => {
          if (d.type === 'project') {
            const project = projects.find(p => p.id === d.id);
            if (project) onProjectClick(project);
          }
        })
        .on("mouseover", function (event, d) {
          d3.select(this).attr('r', d.type === 'tag' ? 30 : 20);
          d3.select(`#label-${d.id.replace(/[^a-zA-Z0-9-_]/g, '_')}`).style("opacity", 1);

          let title = d.name;
          let description = '';
          let details = '';

          if (d.type === 'project') {
            const project = projects.find(p => p.id === d.id);
            if (project) {
              title = project.title_ru;
              description = project.annotation.slice(0, 150) + (project.annotation.length > 150 ? '...' : '');
              details = `Теги: ${project.tags.join(', ')}`;
            }
          } else if (d.type === 'tag') {
            description = `Проектов: ${projects.filter(p => p.tags.includes(d.name)).length}`;
          }

          setTooltip({
            title,
            description,
            details,
            x: event.pageX,
            y: event.pageY,
            visible: true,
          });
        })
        .on("mouseout", function (_event, d) {
          d3.select(this).attr('r', d.type === 'tag' ? 25 : 15);
          d3.select(`#label-${d.id.replace(/[^a-zA-Z0-9-_]/g, '_')}`).style("opacity", d.type === 'project' ? 0 : 1);
          setTooltip(t => ({ ...t, visible: false }));
        });

      const labels = g.append("g")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("id", d => `label-${d.id.replace(/[^a-zA-Z0-9-_]/g, '_')}`)
        .text(d => d.name)
        .style("opacity", d => d.type === 'project' ? 0 : 1)
        .attr("font-size", d => d.type === 'tag' ? '16px' : '10px')
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .call(wrapText, 150);

      simulation.on("tick", () => {
        link
          .attr("x1", d => (d.source as any).x)
          .attr("y1", d => (d.source as any).y)
          .attr("x2", d => (d.target as any).x)
          .attr("y2", d => (d.target as any).y);

        node
          .attr("cx", d => d.x!)
          .attr("cy", d => d.y!);
        
        labels
          .attr("transform", d => `translate(${d.x}, ${d.y! + (d.type === 'tag' ? 35 : 25)})`);
      });
    }

    // Cleanup
    return () => {
      if (simulation) {
        simulation.stop();
      }
    };
  }, [viewMode, selectedSupervisorId, selectedTag, projects, supervisors, onProjectClick, onSupervisorClick, width, height]);

  const handleReset = () => {
    setViewMode('overview');
    setSelectedSupervisorId(null);
    setSelectedTag(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Карта проектов</h3>
        <div className="flex items-center space-x-2">
          {viewMode.startsWith('supervisor') || viewMode.startsWith('tag') ? (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <Home className="h-4 w-4 mr-2" />
              К обзору руководителей
            </Button>
          ) : null}

          <Button 
            variant={viewMode.startsWith('supervisor') || viewMode === 'overview' ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => { setViewMode('overview'); setSelectedSupervisorId(null); setSelectedTag(null); }}>
            <Users className="h-4 w-4 mr-2" />
            Руководители
          </Button>
          <Button 
            variant={viewMode.startsWith('tag') ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => { setViewMode('tags'); setSelectedSupervisorId(null); setSelectedTag(null); }}>
            <Tags className="h-4 w-4 mr-2" />
            Теги
          </Button>

          <div className="flex items-center space-x-4 text-sm text-gray-600 border-l pl-4 ml-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Руководители
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Проекты
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Теги
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
      
      {tooltip.visible && (
        <div
          className="absolute bg-white border border-gray-200 text-gray-800 text-sm rounded-md p-3 shadow-lg pointer-events-none z-10"
          style={{ top: tooltip.y + 10, left: tooltip.x + 10, maxWidth: '300px' }}
        >
          <h4 className="font-bold text-base mb-1">{tooltip.title}</h4>
          <p className="text-gray-600">{tooltip.description}</p>
          {tooltip.details && <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">{tooltip.details}</p>}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>• Кликните на руководителя для просмотра его проектов.</p>
        <p>• Наведите курсор для просмотра детальной информации.</p>
        <p>• Используйте колесо мыши для масштабирования и перетаскивайте для навигации.</p>
      </div>
    </div>
  );
};
