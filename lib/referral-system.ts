import { createClient } from '@supabase/supabase-js'

/**
 * Handle referral reward after new user signup
 * Called after successful OTP verification and profile creation
 */
export async function processReferralReward(userId: string, userFullName: string) {
  try {
    const referralCode = localStorage.getItem('referral_code')
    
    if (!referralCode) {
      console.log('[v0] No referral code found, skipping reward')
      return
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Call the RPC function to reward referrer
    const { data, error } = await supabase.rpc('reward_referrer', {
      referral_code_input: referralCode,
      new_user_id: userId,
      new_user_name: userFullName,
    })

    if (error) {
      console.error('[v0] Error processing referral reward:', error)
      return { success: false, error: error.message }
    }

    // Clear referral code from localStorage
    localStorage.removeItem('referral_code')

    console.log('[v0] Referral reward processed successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('[v0] Referral reward exception:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Detect and store referral code from URL
 */
export function detectAndStoreReferralCode() {
  try {
    const params = new URLSearchParams(window.location.search)
    const referralCode = params.get('ref')

    if (referralCode) {
      // Validate referral code format (prevent invalid codes)
      if (referralCode.length > 3 && referralCode.length < 50) {
        localStorage.setItem('referral_code', referralCode)
        console.log('[v0] Referral code stored:', referralCode)
        return referralCode
      }
    }
    return null
  } catch (error) {
    console.error('[v0] Error detecting referral code:', error)
    return null
  }
}

/**
 * Prevent duplicate referrals for the same user
 */
export async function checkDuplicateReferral(userId: string): Promise<boolean> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('referral_transactions')
      .select('id')
      .eq('referred_user_id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      // No existing referral found - safe to proceed
      return false
    }

    // Duplicate referral found
    return !!data
  } catch (error) {
    console.error('[v0] Error checking duplicate referral:', error)
    return true // Err on the side of caution
  }
}
