import { createClient } from '@supabase/supabase-js'

// Get Supabase client instance
const getSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Auto-create wallet for new users on login/signup
export const ensureWalletExists = async (userId: string): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()
    // Check if wallet already exists
    const { data: existingWallet, error: checkError } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('[v0] Error checking wallet:', checkError)
      return false
    }

    // If wallet exists, return success
    if (existingWallet) {
      return true
    }

    // Create new wallet with default balance
    const { error: createError } = await supabase
      .from('wallets')
      .insert({
        user_id: userId,
        balance: 250000, // Default NGN 250,000
      })

    if (createError) {
      console.error('[v0] Error creating wallet:', createError)
      return false
    }

    console.log('[v0] Wallet created successfully for user:', userId)
    return true
  } catch (err) {
    console.error('[v0] Error in ensureWalletExists:', err)
    return false
  }
}

// Get user wallet balance
export const getWalletBalance = async (userId: string): Promise<number | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('[v0] Error fetching wallet:', error)
      return null
    }

    return data?.balance || 0
  } catch (err) {
    console.error('[v0] Error in getWalletBalance:', err)
    return null
  }
}

// Deduct balance from wallet
export const deductWalletBalance = async (userId: string, amount: number): Promise<number | null> => {
  try {
    // Get current balance
    const currentBalance = await getWalletBalance(userId)
    if (currentBalance === null) {
      console.error('[v0] Failed to get current balance')
      return null
    }

    // Check if sufficient balance
    if (currentBalance < amount) {
      console.error('[v0] Insufficient balance:', { current: currentBalance, required: amount })
      return null
    }

    const newBalance = currentBalance - amount

    // Update balance
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', userId)

    if (error) {
      console.error('[v0] Error updating wallet:', error)
      return null
    }

    console.log('[v0] Balance deducted:', { userId, amount, newBalance })
    return newBalance
  } catch (err) {
    console.error('[v0] Error in deductWalletBalance:', err)
    return null
  }
}

// Add balance to wallet (for rewards, refunds, etc)
export const addWalletBalance = async (userId: string, amount: number): Promise<number | null> => {
  try {
    const currentBalance = await getWalletBalance(userId)
    if (currentBalance === null) {
      console.error('[v0] Failed to get current balance')
      return null
    }

    const newBalance = currentBalance + amount

    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', userId)

    if (error) {
      console.error('[v0] Error updating wallet:', error)
      return null
    }

    console.log('[v0] Balance added:', { userId, amount, newBalance })
    return newBalance
  } catch (err) {
    console.error('[v0] Error in addWalletBalance:', err)
    return null
  }
}

// Record transaction
export const recordTransaction = async (transaction: {
  user_id: string
  type: string
  amount: number
  status: string
  description: string
}): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        created_at: new Date().toISOString(),
        transaction_id: Date.now().toString(),
      })

    if (error) {
      console.error('[v0] Error recording transaction:', error)
      return false
    }

    console.log('[v0] Transaction recorded:', transaction)
    return true
  } catch (err) {
    console.error('[v0] Error in recordTransaction:', err)
    return false
  }
}
