import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jmpqpsqlkolhbuhsbvto.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcHFwc3Fsa29saGJ1aHNidnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjE5NTMsImV4cCI6MjA1OTY5Nzk1M30.GAfDjeDze-KmJonyCYTbZ0WxPjXHzT7hDnBTr0ZI0X0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}) 