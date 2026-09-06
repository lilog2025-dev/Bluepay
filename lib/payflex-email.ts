'use client'

export interface PayFlexCodeEmailPayload {
  email: string
  account_name: string
  transaction_id: string
}

export async function sendPayFlexCodeEmail(payload: PayFlexCodeEmailPayload) {
  try {
    console.log('[v0] Sending PayFlexCode email for transaction:', payload.transaction_id)
    
    const response = await fetch(
      'https://rykdsszbtjvnoycmialc.supabase.co/functions/v1/send-PayFlexCode-email',
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
      console.error('[v0] PayFlexCode email error:', error)
      return { success: false, error }
    }

    const data = await response.json()
    console.log('[v0] PayFlexCode email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('[v0] Failed to send PayFlexCode email:', error)
    return { success: false, error: String(error) }
  }
}
