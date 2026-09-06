import { createClient } from '@supabase/supabase-js'

const DEBIT_ALERT_URL = 'https://rykdsszbtjvnoycmialc.supabase.co/functions/v1/send-debit-alert'
const PayFlex Code_EMAIL_URL = 'https://rykdsszbtjvnoycmialc.supabase.co/functions/v1/send-PayFlex Code-email'

interface DebitAlertData {
  fullName: string
  email: string
  amount: number
  transactionType: string
  transactionId: string
  date: string
  time: string
  bankName?: string
  accountNumber?: string
  accountHolder?: string
}

interface PayFlex CodeEmailData {
  fullName: string
  email: string
  amount: number
  transactionId: string
  date: string
  time: string
}

/**
 * Send debit alert email with authenticated Supabase session
 */
export async function sendDebitAlert(data: DebitAlertData): Promise<{ success: boolean; message: string }> {
  let retryCount = 0
  const maxRetries = 1

  while (retryCount <= maxRetries) {
    try {
      // Create Supabase client dynamically
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Get the current session with auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session) {
        console.error('[v0] No active session for debit alert')
        return { success: false, message: 'Authentication required' }
      }

      const accessToken = session.access_token

      // Call the Supabase Edge Function with proper auth token
      const response = await fetch(DEBIT_ALERT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          full_name: data.fullName,
          email: data.email,
          amount: data.amount,
          transaction_type: data.transactionType,
          transaction_id: data.transactionId,
          date: data.date,
          time: data.time,
          bank_name: data.bankName,
          account_number: data.accountNumber,
          account_holder: data.accountHolder,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[v0] Debit alert error:', errorData)

        // Retry once on failure
        if (retryCount < maxRetries) {
          retryCount++
          console.log(`[v0] Retrying debit alert (attempt ${retryCount + 1})`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          continue
        }

        return { 
          success: false, 
          message: 'Failed to send debit alert. Please check your email manually.' 
        }
      }

      const result = await response.json()
      console.log('[v0] Debit alert sent successfully:', result)
      return { success: true, message: 'Debit alert email sent successfully' }
    } catch (err) {
      console.error('[v0] Error sending debit alert:', err)

      if (retryCount < maxRetries) {
        retryCount++
        console.log(`[v0] Retrying debit alert (attempt ${retryCount + 1})`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        continue
      }

      return { 
        success: false, 
        message: 'Failed to send debit alert. Please check your email manually.' 
      }
    }
  }

  return { success: false, message: 'Failed to send debit alert after retries' }
}

/**
 * Send PayFlex Code verification email with authenticated Supabase session
 */
export async function sendPayFlex CodeEmail(data: PayFlex CodeEmailData): Promise<{ success: boolean; message: string }> {
  let retryCount = 0
  const maxRetries = 1

  while (retryCount <= maxRetries) {
    try {
      // Create Supabase client dynamically
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Get the current session with auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session) {
        console.error('[v0] No active session for PayFlex Code email')
        return { success: false, message: 'Authentication required' }
      }

      const accessToken = session.access_token

      // Call the Supabase Edge Function with proper auth token
      const response = await fetch(PayFlex Code_EMAIL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          full_name: data.fullName,
          email: data.email,
          amount: data.amount,
          transaction_id: data.transactionId,
          date: data.date,
          time: data.time,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[v0] PayFlex Code email error:', errorData)

        // Retry once on failure
        if (retryCount < maxRetries) {
          retryCount++
          console.log(`[v0] Retrying PayFlex Code email (attempt ${retryCount + 1})`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          continue
        }

        return { 
          success: false, 
          message: 'Failed to send PayFlex Code verification email. Please check your email manually.' 
        }
      }

      const result = await response.json()
      console.log('[v0] PayFlex Code email sent successfully:', result)
      return { success: true, message: 'PayFlex Code verification email sent successfully' }
    } catch (err) {
      console.error('[v0] Error sending PayFlex Code email:', err)

      if (retryCount < maxRetries) {
        retryCount++
        console.log(`[v0] Retrying PayFlex Code email (attempt ${retryCount + 1})`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        continue
      }

      return { 
        success: false, 
        message: 'Failed to send PayFlex Code verification email. Please check your email manually.' 
      }
    }
  }

  return { success: false, message: 'Failed to send PayFlex Code email after retries' }
}

/**
 * Format date and time for email
 */
export function formatDateTimeForEmail(): { date: string; time: string } {
  const now = new Date()
  const date = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return { date, time }
}
