import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ylweomuodekukjjpjrgx.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsd2VvbXVvZGVrdWtqanBqcmd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NTczMDMsImV4cCI6MjEwMzAzMzMwM30.g75fot8jU_36gPD6sQCL81MUUZUfoJLDxL9eSsFAHaE';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
