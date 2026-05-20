'use client'

import { createClient } from '@supabase/supabase-js'

/**
 * Get Supabase client instance
 */
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

/**
 * Get user's current balance from Supabase
 * If wallet doesn't exist, initializes it with default balance of 250000
 */
export async function getCurrentBalance(userId: string): Promise<number> {
  try {
    const supabase = getSupabaseClient()
    
    // Try to fetch existing wallet
    const { data, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single()

    // If wallet exists, return the balance
    if (data?.balance !== undefined) {
      return Number(data.balance)
    }

    // If wallet doesn't exist (PGRST116 error), initialize it
    if (error?.code === 'PGRST116') {
      console.log('[v0] Wallet not found for user:', userId, 'Initializing with default balance')
      const initialized = await initializeWallet(userId, 250000)
      if (initialized) {
        return 250000
      }
      // If initialization fails, return default balance anyway for UI
      return 250000
    }

    // For other errors, return default balance
    if (error) {
      console.error('[v0] Error fetching balance:', error)
      return 250000 // Return default balance on error
    }

    return 250000 // Default balance if nothing found
  } catch (err) {
    console.error('[v0] Error in getCurrentBalance:', err)
    return 250000 // Return default balance on error
  }
}

/**
 * Deduct amount from user's balance
 * Returns updated balance or null if failed
 */
export async function deductBalance(
  userId: string,
  amount: number
): Promise<number | null> {
  try {
    const supabase = getSupabaseClient()
    
    // Prevent negative amounts
    if (amount <= 0) {
      console.error('[v0] Invalid amount for deduction:', amount)
      return null
    }

    // Get current balance
    const { data: userData, error: fetchError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      console.error('[v0] Error fetching user balance:', fetchError)
      return null
    }

    const currentBalance = Number(userData?.balance || 0)

    // Check if sufficient balance
    if (currentBalance < amount) {
      console.error('[v0] Insufficient balance. Current:', currentBalance, 'Required:', amount)
      return null
    }

    // Calculate new balance
    const newBalance = currentBalance - amount

    // Update balance in database
    const { data: updateData, error: updateError } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', userId)
      .select('balance')
      .single()

    if (updateError) {
      console.error('[v0] Error updating balance:', updateError)
      return null
    }

    console.log('[v0] Balance deducted successfully. New balance:', newBalance)
    return Number(updateData?.balance || newBalance)
  } catch (err) {
    console.error('[v0] Error in deductBalance:', err)
    return null
  }
}

/**
 * Add amount to user's balance (for refunds, rewards, etc.)
 */
export async function addBalance(
  userId: string,
  amount: number
): Promise<number | null> {
  try {
    const supabase = getSupabaseClient()
    
    if (amount <= 0) {
      console.error('[v0] Invalid amount for addition:', amount)
      return null
    }

    const { data: userData, error: fetchError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      console.error('[v0] Error fetching user balance:', fetchError)
      return null
    }

    const currentBalance = Number(userData?.balance || 0)
    const newBalance = currentBalance + amount

    const { data: updateData, error: updateError } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', userId)
      .select('balance')
      .single()

    if (updateError) {
      console.error('[v0] Error updating balance:', updateError)
      return null
    }

    return Number(updateData?.balance || newBalance)
  } catch (err) {
    console.error('[v0] Error in addBalance:', err)
    return null
  }
}

/**
 * Check if user has sufficient balance
 */
export async function hasSufficientBalance(
  userId: string,
  amount: number
): Promise<boolean> {
  try {
    const currentBalance = await getCurrentBalance(userId)
    return currentBalance >= amount
  } catch (err) {
    console.error('[v0] Error checking balance sufficiency:', err)
    return false
  }
}

/**
 * Subscribe to balance changes in realtime
 */
export function subscribeToBalance(
  userId: string,
  callback: (balance: number) => void
): () => void {
  try {
    const supabase = getSupabaseClient()
    const channel = supabase
      .channel(`balance:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBalance = Number(payload.new?.balance || 0)
          callback(newBalance)
          console.log('[v0] Balance updated via subscription:', newBalance)
        }
      )
      .subscribe()

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel)
    }
  } catch (err) {
    console.error('[v0] Error subscribing to balance:', err)
    return () => {} // Return no-op function
  }
}

/**
 * Initialize wallet for new user
 * Safely handles duplicate wallets without overwriting existing balances
 */
export async function initializeWallet(
  userId: string,
  initialBalance: number = 250000
): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()
    
    // First check if wallet already exists
    const { data: existingWallet, error: fetchError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single()

    // If wallet exists, don't create a new one
    if (existingWallet) {
      console.log('[v0] Wallet already exists for user:', userId, 'Balance:', existingWallet.balance)
      return true
    }

    // If fetch error is not "no rows found", log it
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('[v0] Error checking existing wallet:', fetchError)
    }

    // Create new wallet with initial balance
    const { error: insertError } = await supabase.from('wallets').insert([
      {
        user_id: userId,
        balance: initialBalance,
      },
    ])

    if (insertError) {
      // Ignore duplicate key errors - wallet may have been created by another process
      if (insertError.code === '23505') {
        console.log('[v0] Wallet already exists (duplicate key):', userId)
        return true
      }
      console.error('[v0] Error initializing wallet:', insertError)
      return false
    }

    console.log('[v0] Wallet initialized for user:', userId, 'Balance:', initialBalance)
    return true
  } catch (err) {
    console.error('[v0] Error in initializeWallet:', err)
    return false
  }
}
