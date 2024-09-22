import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxwnkjqsiwqtussjnfxk.supabase.co' // Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4d25ranFzaXdxdHVzc2puZnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5NjY2MjksImV4cCI6MjA0MTU0MjYyOX0.VsYevGqjqGwQ4-UoMUF6xGku1w9Ssln-2Lr1wagj7es' // Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);