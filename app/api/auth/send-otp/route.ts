import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'
import { generateOTP, validateEmail } from '@/lib/utils'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Generate OTP code
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes

    // Store OTP in database
    const { error: dbError } = await supabase
      .from('otp_tokens')
      .insert([
        {
          email,
          code: otp,
          expires_at: expiresAt,
        },
      ])

    if (dbError) {
      console.error('[v0] OTP storage error:', dbError)
      return NextResponse.json(
        { error: 'Failed to generate OTP' },
        { status: 500 }
      )
    }

    // Send OTP email
    const { error: emailError } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@bluepay.com',
      to: email,
      subject: 'Your BLUEPAY DIGITAL Verification Code',
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0000ff; margin: 0;">BLUEPAY DIGITAL</h1>
          </div>
          <div style="background: linear-gradient(135deg, #0000ff 0%, #4f46e5 100%); border-radius: 10px; padding: 30px; text-align: center;">
            <h2 style="color: white; margin-top: 0;">Verify Your Email</h2>
            <p style="color: rgba(255,255,255,0.9); margin-bottom: 20px;">Your verification code is:</p>
            <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <p style="font-size: 32px; font-weight: bold; color: #0000ff; margin: 0; letter-spacing: 5px;">${otp}</p>
            </div>
            <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 0;">This code expires in 5 minutes</p>
          </div>
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    if (emailError) {
      console.error('[v0] Email send error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      maskedEmail: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
    })
  } catch (error) {
    console.error('[v0] Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
