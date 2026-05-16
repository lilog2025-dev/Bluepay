import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string
          profile_picture_url: string | null
          security_pin: string | null
          fingerprint_enabled: boolean
          referral_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          email: string
          full_name: string
          phone?: string
          referral_code?: string
        }
        Update: {
          full_name?: string
          profile_picture_url?: string | null
          security_pin?: string | null
          fingerprint_enabled?: boolean
        }
      }
      otp_tokens: {
        Row: {
          id: string
          email: string
          code: string
          expires_at: string
          created_at: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'airtime' | 'data' | 'transfer' | 'bill' | 'withdrawal'
          amount: number
          description: string
          status: 'pending' | 'completed' | 'failed'
          created_at: string
        }
      }
    }
  }
}
