import { supabase, handleSupabaseError } from './supabase';
import { updateProject } from './projects';

/**
 * Create a new sample analysis
 * @param {Object} analysisData - Analysis data
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Result object with analysis data or error
 */
export const createSampleAnalysis = async (analysisData, projectId) => {
  try {
    const { data, error } = await supabase
      .from('sampleAnalyses')
      .insert({
        ...analysisData,
        projectId,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update project status
    await updateProject(projectId, {
      status: 'analyzed',
      sampleClearanceStatus: analysisData.riskAssessmentScore > 70 ? 'high-risk' : 'analyzed'
    });
    
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Create sample analysis') 
    };
  }
};

/**
 * Get all analyses for a project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Result object with analyses data or error
 */
export const getProjectAnalyses = async (projectId) => {
  try {
    const { data, error } = await supabase
      .from('sampleAnalyses')
      .select('*')
      .eq('projectId', projectId)
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Get project analyses') 
    };
  }
};

/**
 * Get a sample analysis by ID
 * @param {string} analysisId - Analysis ID
 * @returns {Promise<Object>} Result object with analysis data or error
 */
export const getAnalysisById = async (analysisId) => {
  try {
    const { data, error } = await supabase
      .from('sampleAnalyses')
      .select('*')
      .eq('id', analysisId)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Get analysis by ID') 
    };
  }
};

/**
 * Update a sample analysis
 * @param {string} analysisId - Analysis ID
 * @param {Object} updates - Analysis fields to update
 * @returns {Promise<Object>} Result object with updated analysis data or error
 */
export const updateAnalysis = async (analysisId, updates) => {
  try {
    const { data, error } = await supabase
      .from('sampleAnalyses')
      .update({
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .eq('id', analysisId)
      .select()
      .single();
    
    if (error) throw error;
    
    // If risk assessment score is updated, update project status
    if (updates.riskAssessmentScore !== undefined) {
      const { data: analysis } = await getAnalysisById(analysisId);
      if (analysis) {
        await updateProject(analysis.projectId, {
          sampleClearanceStatus: updates.riskAssessmentScore > 70 ? 'high-risk' : 'analyzed'
        });
      }
    }
    
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Update analysis') 
    };
  }
};

/**
 * Delete a sample analysis
 * @param {string} analysisId - Analysis ID
 * @returns {Promise<Object>} Result object indicating success or error
 */
export const deleteAnalysis = async (analysisId) => {
  try {
    // Get analysis to get project ID
    const { data: analysis } = await getAnalysisById(analysisId);
    
    const { error } = await supabase
      .from('sampleAnalyses')
      .delete()
      .eq('id', analysisId);
    
    if (error) throw error;
    
    // Update project status if this was the only analysis
    if (analysis) {
      const { data: remainingAnalyses } = await getProjectAnalyses(analysis.projectId);
      if (!remainingAnalyses || remainingAnalyses.length === 0) {
        await updateProject(analysis.projectId, {
          status: 'created',
          sampleClearanceStatus: 'pending'
        });
      }
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Delete analysis') 
    };
  }
};

/**
 * Get identified samples from an analysis
 * @param {string} analysisId - Analysis ID
 * @returns {Promise<Object>} Result object with samples data or error
 */
export const getIdentifiedSamples = async (analysisId) => {
  try {
    const { data, error } = await supabase
      .from('identifiedSamples')
      .select('*')
      .eq('analysisId', analysisId);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Get identified samples') 
    };
  }
};

/**
 * Add identified sample to an analysis
 * @param {Object} sampleData - Sample data
 * @param {string} analysisId - Analysis ID
 * @returns {Promise<Object>} Result object with sample data or error
 */
export const addIdentifiedSample = async (sampleData, analysisId) => {
  try {
    const { data, error } = await supabase
      .from('identifiedSamples')
      .insert({
        ...sampleData,
        analysisId,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Add identified sample') 
    };
  }
};
