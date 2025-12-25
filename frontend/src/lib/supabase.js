
import { createClient } from '@supabase/supabase-js';

// Access environment variables (Vite uses import.meta.env.VITE_...)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Warn if keys are missing (dev friendly)
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase Environment Variables!');
    console.log('VITE_SUPABASE_URL:', supabaseUrl);
    console.warn('⚠️ Supabase URL or Anon Key is missing. Check your .env file.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
