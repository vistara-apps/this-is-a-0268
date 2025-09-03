import { useState } from 'react';
import { 
  createSampleAnalysis, 
  getProjectAnalyses, 
  getAnalysisById,
  updateAnalysis as updateAnalysisApi,
  deleteAnalysis as deleteAnalysisApi,
  getIdentifiedSamples,
  addIdentifiedSample
} from '../api/sampleAnalysis';
import { useProjects } from './useProjects';

/**
 * Custom hook for sample analysis operations
 * @returns {Object} Sample analysis operations and state
 */
const useSampleAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const { updateProject } = useProjects();

  /**
   * Create a new sample analysis
   * @param {Object} analysisData - Analysis data
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Result object with analysis data or error
   */
  const createAnalysis = async (analysisData, projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await createSampleAnalysis(analysisData, projectId);
      
      if (result.success) {
        // Update analyses list if we have it loaded
        setAnalyses(prev => [result.data, ...prev]);
      } else {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to create sample analysis';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get all analyses for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Result object with analyses data or error
   */
  const fetchProjectAnalyses = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getProjectAnalyses(projectId);
      
      if (result.success) {
        setAnalyses(result.data || []);
      } else {
        setError(result.error.message);
        setAnalyses([]);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to fetch project analyses';
      setError(errorMsg);
      console.error(errorMsg, err);
      setAnalyses([]);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get a sample analysis by ID
   * @param {string} analysisId - Analysis ID
   * @returns {Promise<Object>} Result object with analysis data or error
   */
  const fetchAnalysis = async (analysisId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getAnalysisById(analysisId);
      
      if (!result.success) {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to fetch analysis';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a sample analysis
   * @param {string} analysisId - Analysis ID
   * @param {Object} updates - Analysis fields to update
   * @returns {Promise<Object>} Result object with updated analysis data or error
   */
  const updateAnalysis = async (analysisId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await updateAnalysisApi(analysisId, updates);
      
      if (result.success) {
        // Update analyses list if we have it loaded
        setAnalyses(prev => 
          prev.map(analysis => 
            analysis.id === analysisId ? result.data : analysis
          )
        );
      } else {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to update analysis';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a sample analysis
   * @param {string} analysisId - Analysis ID
   * @returns {Promise<Object>} Result object indicating success or error
   */
  const deleteAnalysis = async (analysisId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await deleteAnalysisApi(analysisId);
      
      if (result.success) {
        // Update analyses list if we have it loaded
        setAnalyses(prev => prev.filter(analysis => analysis.id !== analysisId));
      } else {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to delete analysis';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get identified samples from an analysis
   * @param {string} analysisId - Analysis ID
   * @returns {Promise<Object>} Result object with samples data or error
   */
  const fetchIdentifiedSamples = async (analysisId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getIdentifiedSamples(analysisId);
      
      if (!result.success) {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to fetch identified samples';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add identified sample to an analysis
   * @param {Object} sampleData - Sample data
   * @param {string} analysisId - Analysis ID
   * @returns {Promise<Object>} Result object with sample data or error
   */
  const addSample = async (sampleData, analysisId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await addIdentifiedSample(sampleData, analysisId);
      
      if (!result.success) {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to add identified sample';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  return {
    analyses,
    loading,
    error,
    createAnalysis,
    getProjectAnalyses: fetchProjectAnalyses,
    getAnalysis: fetchAnalysis,
    updateAnalysis,
    deleteAnalysis,
    getIdentifiedSamples: fetchIdentifiedSamples,
    addIdentifiedSample: addSample
  };
};

export default useSampleAnalysis;
