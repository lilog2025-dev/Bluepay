
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email, amount } = body

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    // 1. MOCK / TEST MODE (Runs if no Paystack API key is set in environment variables)
    if (!paystackSecretKey) {
      return NextResponse.json(
        {
          status: true,
          message: 'Virtual account created successfully (Simulated Test Mode)',
          data: {
            bank_name: 'Wema Bank (Test)',
            account_number: '99' + Math.floor(10000000 + Math.random() * 90000000),
            account_name: 'PayFlex - ' + (email ? email.split('@')[0].toUpperCase() : 'USER'),
            amount: amount || 5000,
          },
        },
        { status: 200 }
      )
    }

    // 2. LIVE PAYSTACK API INTEGRATION (Runs when PAYSTACK_SECRET_KEY is provided in .env)
    const paystackResponse = await fetch('https://api.paystack.co/dedicated_account', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: email,
        preferred_bank: 'wema-bank',
      }),
    })

    const data = await paystackResponse.json()

    if (!paystackResponse.ok) {
      return NextResponse.json(
        { status: false, message: data.message || 'Failed to generate account' },
        { status: paystackResponse.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
