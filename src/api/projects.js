import { supabase, handleSupabaseError } from './supabase';

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Result object with project data or error
 */
export const createProject = async (projectData, userId) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        userId,
        status: 'created',
        sampleClearanceStatus: 'pending',
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Create project') 
    };
  }
};

/**
 * Get all projects for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Result object with projects data or error
 */
export const getUserProjects = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Get user projects') 
    };
  }
};

/**
 * Get a project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Result object with project data or error
 */
export const getProjectById = async (projectId) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        sampleAnalyses(*)
      `)
      .eq('id', projectId)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Get project by ID') 
    };
  }
};

/**
 * Update a project
 * @param {string} projectId - Project ID
 * @param {Object} updates - Project fields to update
 * @returns {Promise<Object>} Result object with updated project data or error
 */
export const updateProject = async (projectId, updates) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Update project') 
    };
  }
};

/**
 * Delete a project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Result object indicating success or error
 */
export const deleteProject = async (projectId) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Delete project') 
    };
  }
};

/**
 * Upload audio file for a project
 * @param {File} file - Audio file
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Result object with file URL or error
 */
export const uploadProjectAudio = async (file, projectId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${projectId}-${Date.now()}.${fileExt}`;
    const filePath = `project-audio/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('audio-files')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('audio-files')
      .getPublicUrl(filePath);
    
    // Update project with audio file URL
    const { error: updateError } = await supabase
      .from('projects')
      .update({ 
        audioFileUrl: urlData.publicUrl,
        updatedAt: new Date().toISOString()
      })
      .eq('id', projectId);
    
    if (updateError) throw updateError;
    
    return { 
      success: true, 
      data: { url: urlData.publicUrl } 
    };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Upload project audio') 
    };
  }
};
