import { useState } from 'react';
import { 
  generateLicensingTemplate, 
  generateLegalExplanation, 
  generateLegalAdvice 
} from '../api/openai';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for AI assistance features
 * @returns {Object} AI assistance operations and state
 */
const useAIAssistance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, profile } = useAuth();

  /**
   * Generate a licensing request template
   * @param {Object} sampleInfo - Information about the sample
   * @returns {Promise<Object>} Result object with generated template or error
   */
  const generateTemplate = async (sampleInfo) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare user info from auth context
      const userInfo = {
        name: profile?.fullName || user?.email || '',
        artistName: profile?.artistName || profile?.fullName || '',
        project: sampleInfo.project || 'Upcoming release',
        distribution: sampleInfo.distribution || 'Digital streaming platforms'
      };
      
      const result = await generateLicensingTemplate(sampleInfo, userInfo);
      
      if (!result.success) {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to generate licensing template';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate a legal explanation for a topic
   * @param {string} topic - Legal topic to explain
   * @returns {Promise<Object>} Result object with explanation or error
   */
  const explainLegalTopic = async (topic) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await generateLegalExplanation(topic);
      
      if (!result.success) {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to generate legal explanation';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate personalized legal advice
   * @param {Object} analysisData - Sample analysis data
   * @returns {Promise<Object>} Result object with advice or error
   */
  const getPersonalizedAdvice = async (analysisData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await generateLegalAdvice(analysisData);
      
      if (!result.success) {
        setError(result.error.message);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to generate personalized advice';
      setError(errorMsg);
      console.error(errorMsg, err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateLicensingTemplate: generateTemplate,
    explainLegalTopic,
    getPersonalizedAdvice
  };
};

export default useAIAssistance;
