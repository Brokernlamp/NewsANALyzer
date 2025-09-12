import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON

// Check if we're in demo mode (missing env vars)
export const isDemoMode = !supabaseUrl || !supabaseAnonKey

export const supabase = isDemoMode 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey)

// Log environment status for debugging
if (isDemoMode) {
  console.warn('Supabase environment variables missing. Running in demo mode.')
} else {
  console.log('Supabase client initialized successfully.')
}
