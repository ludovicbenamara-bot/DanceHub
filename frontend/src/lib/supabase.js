
import { createClient } from '@supabase/supabase-js';

// Access environment variables, or fallback to hardcoded valid keys for local dev
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tmpotndntmzhouirlvsh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7SmvfXDPJy6BCsSsFhasIA_8nwV99bW';

if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn('⚠️ Supabase Env Vars missing. Using hardcoded fallback for local dev.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
