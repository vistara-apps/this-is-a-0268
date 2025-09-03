import { supabase, handleSupabaseError } from './supabase';

/**
 * Register a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {Object} metadata - Additional user metadata
 * @returns {Promise<Object>} Result object with user data or error
 */
export const registerUser = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...metadata,
          subscriptionPlan: 'free', // Default plan for new users
          creditsUsed: 0,
          creditsTotal: 1 // Free tier gets 1 credit per month
        }
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'User registration') 
    };
  }
};

/**
 * Login a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Result object with session data or error
 */
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'User login') 
    };
  }
};

/**
 * Logout the current user
 * @returns {Promise<Object>} Result object indicating success or error
 */
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'User logout') 
    };
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise<Object>} Result object indicating success or error
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Password reset') 
    };
  }
};

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Result object indicating success or error
 */
export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Password update') 
    };
  }
};

/**
 * Get user profile data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data or error
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Get user profile') 
    };
  }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile fields to update
 * @returns {Promise<Object>} Updated profile data or error
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error, 'Update user profile') 
    };
  }
};
