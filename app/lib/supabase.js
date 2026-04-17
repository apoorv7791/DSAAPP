import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://othxstpdiiqywcurdtqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aHhzdHBkaWlxeXdjdXJkdHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTQwMjMsImV4cCI6MjA4OTM5MDAyM30.urNSAPWsh52MPnq0eQLJiZqgcqc57OYcDxuhoI93Y9c'; // 👈 dashboard se copy karna hai

export const supabase = createClient(supabaseUrl, supabaseKey);