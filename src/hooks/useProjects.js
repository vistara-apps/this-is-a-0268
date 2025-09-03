import { useState } from 'react';
import { 
  createProject, 
  getProjectById, 
  updateProject as updateProjectApi, 
  deleteProject as deleteProjectApi,
  uploadProjectAudio
} from '../api/projects';
import { useProjects as useProjectsContext } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for project operations
 * @returns {Object} Project operations and state
 */
const useProjects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { 
    projects, 
    addProject, 
    updateProject: updateProjectInContext, 
    removeProject,
    refreshProjects
  } = useProjectsContext();

  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise<Object>} Result object with project data or error
   */
  const createNewProject = async (projectData) => {
    if (!user) {
      return { success: false, error: { message: 'User not authenticated' } };
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await createProject(projectData, user.id);
      
      if (result.success) {
        addProject(result.data);
      } else {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to create project';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get a project by ID
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Result object with project data or error
   */
  const fetchProject = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getProjectById(projectId);
      
      if (!result.success) {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to fetch project';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a project
   * @param {string} projectId - Project ID
   * @param {Object} updates - Project fields to update
   * @returns {Promise<Object>} Result object with updated project data or error
   */
  const updateProjectData = async (projectId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await updateProjectApi(projectId, updates);
      
      if (result.success) {
        updateProjectInContext(result.data);
      } else {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to update project';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Result object indicating success or error
   */
  const deleteProject = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await deleteProjectApi(projectId);
      
      if (result.success) {
        removeProject(projectId);
      } else {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to delete project';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Upload audio file for a project
   * @param {File} file - Audio file
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Result object with file URL or error
   */
  const uploadAudio = async (file, projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4'];
      if (!validTypes.includes(file.type)) {
        const errorMsg = 'Invalid file type. Please upload MP3, WAV, FLAC, or M4A files.';
        setError(errorMsg);
        return { success: false, error: { message: errorMsg } };
      }
      
      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        const errorMsg = 'File too large. Maximum size is 50MB.';
        setError(errorMsg);
        return { success: false, error: { message: errorMsg } };
      }
      
      const result = await uploadProjectAudio(file, projectId);
      
      if (!result.success) {
        setError(result.error.message);
      } else {
        // Update project in context with new audio URL
        const projectResult = await getProjectById(projectId);
        if (projectResult.success) {
          updateProjectInContext(projectResult.data);
        }
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to upload audio file';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    createProject: createNewProject,
    getProject: fetchProject,
    updateProject: updateProjectData,
    deleteProject,
    uploadAudio,
    refreshProjects
  };
};

export default useProjects;
