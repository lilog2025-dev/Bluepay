import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullName, amount, type, transactionCode } = body

    if (!email || !amount || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create debit alert message
    const alertMessage = `
Dear ${fullName || 'User'},

A transaction has been processed on your PayFlex account:

Transaction Type: ${type}
Amount: ₦${parseFloat(amount).toLocaleString()}
Transaction Code: ${transactionCode}
Date & Time: ${new Date().toLocaleString()}

If you did not authorize this transaction, please contact our support team immediately.

Best regards,
PayFlex Team
    `.trim()

    // Log the alert locally (in production, this would integrate with email service like SendGrid, Resend, etc.)
    console.log('[DEBIT ALERT]', {
      to: email,
      subject: `PayFlex Transaction Alert - ₦${parseFloat(amount).toLocaleString()}`,
      message: alertMessage,
      timestamp: new Date().toISOString(),
    })

    // In a production app, you would send the email here:
    // Example with Resend:
    // const { data, error } = await resend.emails.send({
    //   from: 'noreply@PayFlex.com',
    //   to: email,
    //   subject: `PayFlex Transaction Alert - ₦${parseFloat(amount).toLocaleString()}`,
    //   html: alertHtmlTemplate(fullName, amount, type, transactionCode),
    // })

    // Store alert record (optional - for tracking sent alerts)
    try {
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
      const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      await fetch(`${SUPABASE_URL}/rest/v1/debit_alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          full_name: fullName,
          amount: parseFloat(amount),
          type: type,
          transaction_code: transactionCode,
          sent_at: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error('Failed to store alert record:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Debit alert sent successfully',
    })
  } catch (error) {
    console.error('Error sending debit alert:', error)
    return NextResponse.json(
      { error: 'Failed to send debit alert' },
      { status: 500 }
    )
  }
}
