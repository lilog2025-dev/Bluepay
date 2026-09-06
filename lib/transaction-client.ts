'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Transaction types
export type TransactionType = 'airtime' | 'data' | 'withdrawal' | 'betting' | 'electricity' | 'tv_subscription' | 'PayFlex Code_purchase'

// Transaction interface
export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  status: 'pending' | 'completed' | 'failed'
  description?: string
  bank_name?: string
  account_number?: string
  account_holder?: string
  recipient?: string
  created_at: string
  transaction_id: string
  session_id?: string
}

// Fetch user transactions
export async function getUserTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching transactions:', error)
    return []
  }

  return data as Transaction[]
}

// Create transaction
export async function createTransaction(transaction: Omit<Transaction, 'id'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()

  if (error) {
    console.error('[v0] Error creating transaction:', error)
    return null
  }

  return data[0] as Transaction
}

// Update transaction
export async function updateTransaction(id: string, updates: Partial<Transaction>) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('[v0] Error updating transaction:', error)
    return null
  }

  return data[0] as Transaction
}

// Subscribe to user transactions in realtime
export function subscribeToTransactions(userId: string, callback: (transaction: Transaction) => void) {
  const subscription = supabase
    .from('transactions')
    .on('*', payload => {
      if (payload.new.user_id === userId) {
        callback(payload.new as Transaction)
      }
    })
    .subscribe()

  return subscription
}
