import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      console.error('[v0] Missing email or code')
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    console.log('[v0] Verifying OTP for email:', email)

    // Create server-side Supabase client
    const supabase = await createClient()

    // Use Supabase's native verifyOtp method
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })

    if (error) {
      console.error('[v0] Supabase verifyOtp error:', error)
      // Provide specific error messages based on Supabase response
      let userMessage = error.message
      if (error.message?.includes('expired')) {
        userMessage = 'Verification code has expired. Please request a new one.'
      } else if (error.message?.includes('invalid')) {
        userMessage = 'Invalid verification code. Please check and try again.'
      }
      return NextResponse.json(
        { error: userMessage },
        { status: 400 }
      )
    }

    console.log('[v0] OTP verified successfully for:', email)

    // Create user profile in public.users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name || 'User',
        })
        .select()
        .single()

      if (profileError && !profileError.message?.includes('duplicate')) {
        console.error('[v0] Profile creation error:', profileError)
      }

      // Initialize wallet with default balance of 250,000 NGN
      const { error: walletError } = await supabase
        .from('wallets')
        .insert({
          user_id: data.user.id,
          balance: 250000,
        })
        .select()
        .single()

      if (walletError && !walletError.message?.includes('duplicate')) {
        console.error('[v0] Wallet initialization error:', walletError)
        // Continue even if wallet initialization fails - user can still access the app
      } else {
        console.log('[v0] Wallet initialized for user:', data.user.id, 'with balance: 250000')
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      email: email,
      user: data.user,
    })
  } catch (error) {
    console.error('[v0] Verify OTP error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
