import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Handles Supabase errors consistently
 * @param {Error} error - The error object from Supabase
 * @param {string} context - Context where the error occurred
 * @returns {Error} Formatted error object
 */
export const handleSupabaseError = (error, context = 'Supabase operation') => {
  console.error(`${context} failed:`, error);
  
  // Return a formatted error object
  return {
    message: error.message || 'An unexpected error occurred',
    code: error.code || 'unknown_error',
    details: error.details || null,
    context
  };
};

/**
 * Utility to check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

/**
 * Get the current user
 * @returns {Object|null} User object or null if not authenticated
 */
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};

export default supabase;
