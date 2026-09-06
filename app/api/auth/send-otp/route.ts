import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateEmail } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json()

    if (!email || !validateEmail(email)) {
      console.error('[v0] Invalid email:', email)
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Default to false unless explicitly passed as 'signup'
    const isSignUp = type === 'signup'

    console.log(`[v0] Sending OTP (${type || 'signin'}) to email:`, email)

    // Create server-side Supabase client
    const supabase = await createClient()

    // Use Supabase's native Email OTP flow
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: isSignUp, // Enforces that sign-in requires an existing user account
      },
    })

    if (error) {
      console.error('[v0] Supabase signInWithOtp error:', error)
      
      // Friendly message when an unregistered email attempts to sign in
      const errorMessage =
        !isSignUp && error.message.toLowerCase().includes('sign up')
          ? 'Account not found. Please sign up first.'
          : error.message || 'Failed to send verification code'

      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    console.log('[v0] OTP sent successfully to:', email)

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      maskedEmail: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
    })
  } catch (error) {
    console.error('[v0] Send OTP error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
