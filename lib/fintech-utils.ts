'use client'

import { createClient } from '@supabase/supabase-js'
import { generateTransactionId, getCurrentDateTime } from './debit-alert'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Copy to clipboard with callback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('[v0] Copy failed:', err)
    return false
  }
}

// Update user balance after transaction
export async function deductBalance(userId: string, amount: number): Promise<boolean> {
  try {
    // Get current balance
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    const newBalance = Math.max(0, (profile?.balance || 0) - amount)

    // Update balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', userId)

    if (updateError) throw updateError

    console.log('[v0] Balance updated:', { userId, amount, newBalance })
    return true
  } catch (err) {
    console.error('[v0] Balance update failed:', err)
    return false
  }
}

// Record transaction in database
export async function recordTransaction(
  userId: string,
  transactionData: {
    type: string
    amount: number
    provider?: string
    recipient?: string
    description?: string
    sessionId?: string
  }
): Promise<string | null> {
  try {
    const transactionId = generateTransactionId()
    const sessionId = transactionData.sessionId || `SESSION${Date.now()}`

    const { error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          type: transactionData.type,
          amount: transactionData.amount,
          provider: transactionData.provider,
          recipient: transactionData.recipient,
          description: transactionData.description,
          transaction_id: transactionId,
          session_id: sessionId,
          status: 'completed',
          created_at: new Date().toISOString(),
        },
      ])

    if (error) throw error

    console.log('[v0] Transaction recorded:', transactionId)
    return transactionId
  } catch (err) {
    console.error('[v0] Failed to record transaction:', err)
    return null
  }
}

// Format transaction details for success page
export interface TransactionDetails {
  fullName: string
  transactionId: string
  sessionId: string
  amount: number
  transactionType: string
  provider?: string
  recipient?: string
  dateTime: string
  status: 'Successful' | 'Pending' | 'Failed'
}

export function getTransactionDetails(data: Partial<TransactionDetails>): TransactionDetails {
  return {
    fullName: data.fullName || 'BLUEPAY User',
    transactionId: data.transactionId || generateTransactionId(),
    sessionId: data.sessionId || `SESSION${Date.now()}`,
    amount: data.amount || 0,
    transactionType: data.transactionType || 'Transaction',
    provider: data.provider,
    recipient: data.recipient,
    dateTime: data.dateTime || getCurrentDateTime(),
    status: data.status || 'Successful',
  }
}

// Subscribe to balance changes
export function subscribeToBalance(userId: string, callback: (newBalance: number) => void) {
  try {
    const subscription = supabase
      .channel(`profile-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
        (payload) => {
          if (payload.new?.balance !== undefined) {
            callback(payload.new.balance)
          }
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  } catch (err) {
    console.error('[v0] Failed to subscribe to balance:', err)
    return () => {}
  }
}

// Get recent transactions (excluding BPC)
export async function getRecentTransactions(userId: string, limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .neq('type', 'bpc_purchase')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('[v0] Failed to fetch transactions:', err)
    return []
  }
}

// Subscribe to recent transactions
export function subscribeToRecentTransactions(
  userId: string,
  callback: (transactions: any[]) => void
) {
  try {
    const subscription = supabase
      .channel(`transactions-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          // Refetch all transactions on any change
          const transactions = await getRecentTransactions(userId)
          callback(transactions)
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  } catch (err) {
    console.error('[v0] Failed to subscribe to transactions:', err)
    return () => {}
  }
}
