import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ummonlogvmwzcalywuth.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbW9ubG9ndm13emNhbHl3dXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODk5MzQsImV4cCI6MjA5MDE2NTkzNH0.LeXW53D2KYhs-emFv-Cu4jFg5DkhURrjlJD55nacp8I'

export const supabase = createClient(supabaseUrl, supabaseKey)
