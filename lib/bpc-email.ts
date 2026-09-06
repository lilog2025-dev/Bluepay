'use client'

export interface PayFlex CodeEmailPayload {
  email: string
  account_name: string
  transaction_id: string
}

export async function sendPayFlex CodeEmail(payload: PayFlex CodeEmailPayload) {
  try {
    console.log('[v0] Sending PayFlex Code email for transaction:', payload.transaction_id)
    
    const response = await fetch(
      'https://rykdsszbtjvnoycmialc.supabase.co/functions/v1/send-PayFlex Code-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('[v0] PayFlex Code email error:', error)
      return { success: false, error }
    }

    const data = await response.json()
    console.log('[v0] PayFlex Code email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('[v0] Failed to send PayFlex Code email:', error)
    return { success: false, error: String(error) }
  }
}
