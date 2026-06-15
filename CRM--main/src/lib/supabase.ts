import { createClient } from '@supabase/supabase-js';

// Use placeholders if environment variables are missing to prevent app crash on startup.
// You must set these in the Settings > Secrets menu in AI Studio or in your local .env file.
const env = (import.meta as any).env;

// CURRENT PROJECT: ulicipmpbikproqjqjz
const SUPABASE_URL = 'https://zaprovuuvbxjhiapbihk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcHJvdnV1dmJ4amhpYXBiaWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTQ0MzYsImV4cCI6MjA5MTI5MDQzNn0.iO10trwXqZJl-R8Gux7V8iWcZZr-OeBbMll1JwbobRg';

// Use environment variables if they are valid, otherwise fallback to hardcoded
const finalUrl = (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_URL.startsWith('http')) 
  ? env.VITE_SUPABASE_URL 
  : SUPABASE_URL;

const finalKey = (env.VITE_SUPABASE_ANON_KEY && env.VITE_SUPABASE_ANON_KEY.startsWith('eyJ')) 
  ? env.VITE_SUPABASE_ANON_KEY 
  : SUPABASE_KEY;

console.log('--- Supabase Init ---');
console.log('URL:', finalUrl);
console.log('---------------------');

export const supabase = createClient(finalUrl, finalKey);
