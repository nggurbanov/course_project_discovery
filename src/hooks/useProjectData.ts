import { useState, useEffect } from 'react';
import type { ProjectData } from '../types/project.types';
import projectsData from '../data/projects.json';

export const useProjectData = () => {
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rawData = projectsData as any;
      
      // Convert supervisors from object to array if needed
      const supervisors = Array.isArray(rawData.supervisors) 
        ? rawData.supervisors 
        : Object.values(rawData.supervisors);
      
      // Convert tags from object to array if needed
      const tags = Array.isArray(rawData.tags)
        ? rawData.tags
        : Object.keys(rawData.tags);
      
      const transformedData: ProjectData = {
        projects: rawData.projects,
        supervisors,
        tags,
        metadata: rawData.metadata
      };
      
      setData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading project data:', err);
      setError('Failed to load project data');
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
};
