import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Note: We use import.meta.env for Vite environment variables
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'
);
