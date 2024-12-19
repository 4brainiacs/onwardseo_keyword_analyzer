import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://xcrumtibxhxgadevxpye.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjcnVtdGlieGh4Z2FkZXZ4cHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDk0NDIsImV4cCI6MjA1MDE4NTQ0Mn0.7vUqy9efdS3Dbdmt4TWHc7yKRkaQ-P-CC99K4xJNuJg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);