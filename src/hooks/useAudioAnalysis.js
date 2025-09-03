import { useState } from 'react';
import { analyzeAudio } from '../api/audioProcessing';
import { createSampleAnalysis } from '../api/sampleAnalysis';
import { useProjects } from './useProjects';

/**
 * Custom hook for audio analysis operations
 * @returns {Object} Audio analysis operations and state
 */
const useAudioAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const { updateProject } = useProjects();

  /**
   * Analyze audio file and create sample analysis
   * @param {string} audioUrl - URL of the audio file to analyze
   * @param {string} projectId - Project ID
   * @param {Object} metadata - Additional metadata for the analysis
   * @returns {Promise<Object>} Result object with analysis data or error
   */
  const analyzeAudioFile = async (audioUrl, projectId, metadata = {}) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      
      // Simulate progress steps
      const updateProgress = (step) => {
        setProgress(step);
      };
      
      // Step 1: Start analysis
      updateProgress(10);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Process audio
      updateProgress(30);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 3: Analyze audio
      updateProgress(50);
      const analysisResult = await analyzeAudio(audioUrl);
      
      if (!analysisResult.success) {
        throw new Error(analysisResult.error.message);
      }
      
      // Step 4: Create sample analysis in database
      updateProgress(70);
      const { data } = analysisResult;
      
      const analysisData = {
        ...metadata,
        identifiedSampleSource: data.samplesFound,
        riskAssessmentScore: data.riskScore,
        riskLevel: data.riskLevel,
        legalGuidance: data.legalAdvice,
        recommendations: data.recommendations,
        estimatedCost: data.estimatedCost
      };
      
      const createResult = await createSampleAnalysis(analysisData, projectId);
      
      if (!createResult.success) {
        throw new Error(createResult.error.message);
      }
      
      // Step 5: Complete analysis
      updateProgress(100);
      
      // Store result for later use
      setAnalysisResult({
        ...createResult.data,
        samplesFound: data.samplesFound,
        riskScore: data.riskScore,
        riskLevel: data.riskLevel,
        legalAdvice: data.legalAdvice,
        recommendations: data.recommendations,
        estimatedCost: data.estimatedCost
      });
      
      return { 
        success: true, 
        data: {
          ...createResult.data,
          samplesFound: data.samplesFound,
          riskScore: data.riskScore,
          riskLevel: data.riskLevel,
          legalAdvice: data.legalAdvice,
          recommendations: data.recommendations,
          estimatedCost: data.estimatedCost
        }
      };
    } catch (err) {
      const errorMsg = err.message || 'Audio analysis failed';
      setError(errorMsg);
      console.error('Audio analysis error:', err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset analysis state
   */
  const resetAnalysis = () => {
    setLoading(false);
    setProgress(0);
    setError(null);
    setAnalysisResult(null);
  };

  return {
    loading,
    progress,
    error,
    analysisResult,
    analyzeAudio: analyzeAudioFile,
    resetAnalysis
  };
};

export default useAudioAnalysis;
