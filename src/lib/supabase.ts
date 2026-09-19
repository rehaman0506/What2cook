import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables securely without hardcoding credentials
const supabaseUrl = (
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_SUPABASE_URL
    : undefined
) as string | undefined;

const supabaseAnonKey = (
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_SUPABASE_ANON_KEY
    : undefined
) as string | undefined;

// Check if valid Supabase connection details are present
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim().startsWith('https://') &&
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey.trim().length > 10
);

// Initialize Supabase client securely with session persistence
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!.trim(), supabaseAnonKey!.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '%c[What2Cook] Running in Offline & Local Storage Mode. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to connect to your live Supabase database.',
    'color: #f97316; font-weight: bold;'
  );
} else {
  console.info(
    '%c[What2Cook] Supabase Client Connected Successfully.',
    'color: #10b981; font-weight: bold;'
  );
}

export default supabase;
