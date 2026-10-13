import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key') &&
  supabaseUrl.startsWith('https://')
);

if (!isSupabaseConfigured) {
  console.info(
    '%c[Eventra Supabase]%c Running with local/demo fallback. To connect live Supabase, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
    'color: #818cf8; font-weight: bold;',
    'color: inherit;'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
