import axios from 'axios';
import { supabase } from './supabase';

// Audio fingerprinting service API endpoint
const AUDIO_API_URL = import.meta.env.VITE_AUDIO_API_URL;
const AUDIO_API_KEY = import.meta.env.VITE_AUDIO_API_KEY;

if (!AUDIO_API_URL || !AUDIO_API_KEY) {
  console.error('Missing audio API environment variables. Check your .env file.');
}

/**
 * Process audio file for sample identification
 * @param {string} audioUrl - URL of the audio file to analyze
 * @returns {Promise<Object>} Result object with analysis data or error
 */
export const identifySamples = async (audioUrl) => {
  try {
    // Call external audio fingerprinting API
    const response = await axios.post(
      `${AUDIO_API_URL}/identify`,
      { audioUrl },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUDIO_API_KEY}`
        }
      }
    );

    if (response.status !== 200) {
      throw new Error('Audio identification failed');
    }

    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    console.error('Audio identification error:', error);
    return { 
      success: false, 
      error: {
        message: error.response?.data?.message || error.message || 'Audio identification failed',
        code: error.response?.status || 'unknown_error'
      }
    };
  }
};

/**
 * Calculate risk assessment score based on identified samples
 * @param {Array} samples - Array of identified samples
 * @returns {Promise<Object>} Result object with risk assessment data or error
 */
export const calculateRiskScore = async (samples) => {
  try {
    // In a real implementation, this would call an API or use a more sophisticated algorithm
    // For now, we'll use a simple algorithm based on sample clearance status
    
    if (!samples || samples.length === 0) {
      return { 
        success: true, 
        data: { 
          score: 0,
          riskLevel: 'low',
          explanation: 'No samples identified'
        } 
      };
    }

    // Count samples by status
    const unclearedCount = samples.filter(s => s.status === 'uncleared').length;
    const pendingCount = samples.filter(s => s.status === 'pending').length;
    const clearedCount = samples.filter(s => s.status === 'cleared').length;
    
    // Calculate base score
    let score = 0;
    let riskLevel = 'low';
    let explanation = '';
    
    if (unclearedCount > 0) {
      // High risk if any uncleared samples
      score = Math.min(100, 50 + (unclearedCount * 15));
      riskLevel = score > 70 ? 'high' : 'medium';
      explanation = `${unclearedCount} uncleared sample(s) detected`;
    } else if (pendingCount > 0) {
      // Medium risk if pending samples
      score = Math.min(70, 30 + (pendingCount * 10));
      riskLevel = 'medium';
      explanation = `${pendingCount} sample(s) with pending clearance status`;
    } else {
      // Low risk if all samples cleared
      score = Math.max(5, 20 - (clearedCount * 5));
      riskLevel = 'low';
      explanation = `All ${clearedCount} sample(s) have been cleared`;
    }
    
    return { 
      success: true, 
      data: { 
        score,
        riskLevel,
        explanation
      } 
    };
  } catch (error) {
    console.error('Risk assessment error:', error);
    return { 
      success: false, 
      error: {
        message: error.message || 'Risk assessment failed',
        code: 'risk_assessment_error'
      }
    };
  }
};

/**
 * Generate legal recommendations based on identified samples and risk assessment
 * @param {Array} samples - Array of identified samples
 * @param {Object} riskAssessment - Risk assessment data
 * @returns {Promise<Object>} Result object with legal recommendations or error
 */
export const generateLegalRecommendations = async (samples, riskAssessment) => {
  try {
    // In a real implementation, this would call an API (like OpenAI) for more sophisticated recommendations
    // For now, we'll use predefined recommendations based on risk level
    
    const { score, riskLevel } = riskAssessment;
    
    let recommendations = [];
    let estimatedCost = '$0';
    
    if (riskLevel === 'high') {
      recommendations = [
        'Obtain clearance for all uncleared samples before commercial release',
        'Consider replacing high-risk samples with cleared alternatives',
        'Consult with a music attorney before releasing'
      ];
      
      // Estimate cost based on number of uncleared samples
      const unclearedCount = samples.filter(s => s.status === 'uncleared').length;
      estimatedCost = `$${unclearedCount * 150} - $${unclearedCount * 500}`;
    } else if (riskLevel === 'medium') {
      recommendations = [
        'Follow up on pending clearance requests',
        'Prepare alternative versions without uncleared samples',
        'Document all clearance attempts for legal protection'
      ];
      
      // Estimate cost based on number of pending samples
      const pendingCount = samples.filter(s => s.status === 'pending').length;
      estimatedCost = `$${pendingCount * 100} - $${pendingCount * 300}`;
    } else {
      recommendations = [
        'All samples are cleared for use',
        'Keep documentation of all clearances',
        'Monitor for any rights holder changes'
      ];
      
      // Estimate cost based on number of cleared samples
      const clearedCount = samples.filter(s => s.status === 'cleared').length;
      estimatedCost = clearedCount > 0 ? `$${clearedCount * 50}` : '$0';
    }
    
    return { 
      success: true, 
      data: { 
        recommendations,
        estimatedCost,
        legalAdvice: `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} risk: ${riskAssessment.explanation}. ${recommendations[0]}`
      } 
    };
  } catch (error) {
    console.error('Legal recommendations error:', error);
    return { 
      success: false, 
      error: {
        message: error.message || 'Failed to generate legal recommendations',
        code: 'legal_recommendations_error'
      }
    };
  }
};

/**
 * Complete audio analysis pipeline
 * @param {string} audioUrl - URL of the audio file to analyze
 * @returns {Promise<Object>} Result object with complete analysis data or error
 */
export const analyzeAudio = async (audioUrl) => {
  try {
    // Step 1: Identify samples
    const identificationResult = await identifySamples(audioUrl);
    if (!identificationResult.success) {
      throw new Error(identificationResult.error.message);
    }
    
    const samples = identificationResult.data.samples || [];
    
    // Step 2: Calculate risk score
    const riskResult = await calculateRiskScore(samples);
    if (!riskResult.success) {
      throw new Error(riskResult.error.message);
    }
    
    // Step 3: Generate legal recommendations
    const legalResult = await generateLegalRecommendations(samples, riskResult.data);
    if (!legalResult.success) {
      throw new Error(legalResult.error.message);
    }
    
    // Combine all results
    return {
      success: true,
      data: {
        samplesFound: samples,
        riskScore: riskResult.data.score,
        riskLevel: riskResult.data.riskLevel,
        legalAdvice: legalResult.data.legalAdvice,
        recommendations: legalResult.data.recommendations,
        estimatedCost: legalResult.data.estimatedCost
      }
    };
  } catch (error) {
    console.error('Audio analysis error:', error);
    return { 
      success: false, 
      error: {
        message: error.message || 'Audio analysis failed',
        code: 'audio_analysis_error'
      }
    };
  }
};
