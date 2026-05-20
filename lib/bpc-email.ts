'use client'

export interface BpcEmailPayload {
  email: string
  account_name: string
  transaction_id: string
}

export async function sendBpcEmail(payload: BpcEmailPayload) {
  try {
    console.log('[v0] Sending BPC email for transaction:', payload.transaction_id)
    
    const response = await fetch(
      'https://rykdsszbtjvnoycmialc.supabase.co/functions/v1/send-bpc-email',
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
      console.error('[v0] BPC email error:', error)
      return { success: false, error }
    }

    const data = await response.json()
    console.log('[v0] BPC email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('[v0] Failed to send BPC email:', error)
    return { success: false, error: String(error) }
  }
}
