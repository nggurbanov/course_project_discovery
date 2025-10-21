export interface Project {
  id: string;
  title_ru: string;
  title_en: string;
  supervisor: string;
  co_supervisor: string;
  annotation: string;
  goals: string;
  tasks: string;
  requirements: string;
  type: string;
  format: string;
  courses: string[];
  tags: string[];
  contact: string;
  team_size: string;
  selection_form: string;
  preferred_contact: string;
  video_link: string;
  presentation_link: string;
}

export interface Supervisor {
  id: string;
  name: string;
  projects: string[];
}

export interface ProjectData {
  projects: Project[];
  supervisors: Supervisor[];
  tags: string[];
  metadata: {
    total_projects: number;
    total_supervisors: number;
    total_tags: number;
  };
}

export interface FilterState {
  searchQuery: string;
  selectedSupervisor: string;
  selectedCourses: string[];
  selectedTypes: string[];
  selectedFormats: string[];
  selectedTags: string[];
}

export interface GraphNode {
  id: string;
  type: 'supervisor' | 'project' | 'tag';
  name: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'supervisor-project' | 'project-tag';
}
