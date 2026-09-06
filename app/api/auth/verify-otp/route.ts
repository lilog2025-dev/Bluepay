'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'send' | 'verify'>('send')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  // Handler for sending OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      setStep('verify') // Show the code input field!
      setMessage('Code sent to your email!')
    } else {
      setMessage(data.error || 'Failed to send code')
    }
  }

  // Handler for verifying OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      router.push('/dashboard') // Redirect user after successful verification
    } else {
      setMessage(data.error || 'Invalid code')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      {step === 'send' ? (
        <form onSubmit={handleSendOtp}>
          <h2>Sign In to Bluepay</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <h2>Enter Verification Code</h2>
          <p>Sent to {email}</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit code"
            maxLength={6}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  )
}
