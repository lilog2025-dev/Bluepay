'use client'

import { v4 as uuidv4 } from 'uuid'

export interface DebitAlertPayload {
  email: string
  full_name: string
  transaction_type: string
  amount: number
  recipient_name?: string
  recipient_account_number?: string
  recipient_bank_name?: string
  transaction_id: string
  transaction_date: string
}

export async function sendDebitAlert(payload: DebitAlertPayload) {
  try {
    console.log('[v0] Sending debit alert for transaction:', payload.transaction_id)
    
    const response = await fetch(
      'https://rykdsszbtjvnoycmialc.supabase.co/functions/v1/send-debit-alert',
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
      console.error('[v0] Debit alert error:', error)
      return { success: false, error }
    }

    const data = await response.json()
    console.log('[v0] Debit alert sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('[v0] Failed to send debit alert:', error)
    return { success: false, error: String(error) }
  }
}

export function generateTransactionId(): string {
  return `TXN${Date.now()}${uuidv4().slice(0, 8).toUpperCase()}`
}

export function getCurrentDateTime(): string {
  return new Date().toLocaleString('en-NG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}
