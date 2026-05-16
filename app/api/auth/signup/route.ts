import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateEmail } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { email, fullName } = await request.json()

    // Validation
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Generate referral code
    const generatedReferralCode = `BP${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    // Create user in database (OTP-based, no password yet)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email,
          full_name: fullName,
          phone: '',
          referral_code: generatedReferralCode,
          security_pin: null,
          fingerprint_enabled: false,
          profile_picture_url: null,
          is_verified: false,
        },
      ])
      .select()
      .single()

    if (userError) {
      console.error('[v0] User creation error:', userError)
      return NextResponse.json(
        { error: userError.message || 'Failed to create account' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account prepared. Please verify your email.',
      user: {
        email: userData.email,
        fullName: userData.full_name,
      },
    })
  } catch (error) {
    console.error('[v0] Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
