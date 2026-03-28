import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ummonlogvmwzcalywuth.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbW9ubG9ndm13emNhbHl3dXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODk5MzQsImV4cCI6MjA5MDE2NTkzNH0.LeXW53D2KYhs-emFv-Cu4jFg5DkhURrjlJD55nacp8I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 類型定義
export interface Project {
  id: number
  project_id: number
  project_name_en?: string
  project_name_cr?: string
  project_short_name?: string
  trainer?: string
  website?: string
  note?: string
  isActive: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name?: string
  phone?: string
  email?: string
  bank_name?: string
  account_number?: string
  role: string
  leader_id?: number
  isActive: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: number
  project_id: number
  name: string
  phone?: string
  email?: string
  source?: string
  book_appointment_datetime?: string
  prep_status: string
  prep_notes?: string
  leader_id?: number
  closer_id?: number
  closer_prep_status: string
  actual_appointment_datetime?: string
  appointment_prep_status: string
  client_status?: string
  call_summary?: string
  deal_datetime?: string
  deal_plan?: string
  deal_type?: string
  deal_amount?: number
  payment_method?: string
  payment_notes?: string
  created_at: string
  updated_at: string
}

export interface Plan {
  id: number
  plan_id: number
  project_id: number
  plan_name?: string
  plan_price?: number
  created_at: string
  updated_at: string
}
