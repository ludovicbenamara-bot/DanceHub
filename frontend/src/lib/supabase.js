
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tmpotndntmzhouirlvsh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtcG90bmRudG16aG91aXJsdnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2Mjk1MjgsImV4cCI6MjA4MjIwNTUyOH0.4IhKVt1gRwl5ykhDmYo2DqgyUWnuCn5AZke2vMyNVJ8';

if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn('⚠️ Supabase Env Vars missing. Using hardcoded fallback for local dev.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
