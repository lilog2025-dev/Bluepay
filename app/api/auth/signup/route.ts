import { NextRequest, NextResponse } from 'next/server'
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

    // OTP-based signup - user profile will be created after email verification
    return NextResponse.json({
      success: true,
      message: 'Account preparation started. Verification code will be sent.',
      user: {
        email,
        fullName,
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
