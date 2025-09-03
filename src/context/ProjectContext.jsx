import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProjects } from '../api/projects';
import { useAuth } from './AuthContext';

// Create context
const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Fetch user projects when authenticated
  useEffect(() => {
    const fetchProjects = async () => {
      if (!isAuthenticated || !user) {
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const { success, data, error } = await getUserProjects(user.id);
        
        if (success && data) {
          setProjects(data);
        } else if (error) {
          console.error('Error fetching projects:', error);
          setError(error.message || 'Failed to load projects');
        }
      } catch (err) {
        console.error('Project fetch error:', err);
        setError('An unexpected error occurred while loading projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, isAuthenticated]);

  // Add a new project to the context
  const addProject = (project) => {
    setProjects(prev => [project, ...prev]);
  };

  // Update a project in the context
  const updateProject = (updatedProject) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  // Remove a project from the context
  const removeProject = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  // Refresh projects from the server
  const refreshProjects = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { success, data, error } = await getUserProjects(user.id);
      
      if (success && data) {
        setProjects(data);
      } else if (error) {
        console.error('Error refreshing projects:', error);
        setError(error.message || 'Failed to refresh projects');
      }
    } catch (err) {
      console.error('Project refresh error:', err);
      setError('An unexpected error occurred while refreshing projects');
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    removeProject,
    refreshProjects
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

// Custom hook to use project context
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectContext;
