import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Initialize Supabase client
const supabaseUrl = 'https://kziddaasemwsgagzfydj.supabase.co'
const supabaseKey = 'sb_publishable_zuyO0igl-t985dkVT2APWg_uT14pf4s'

export const supabase = createClient(supabaseUrl, supabaseKey)
