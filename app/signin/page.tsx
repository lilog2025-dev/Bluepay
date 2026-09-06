'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'send' | 'verify'>('send')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      setLoading(false)

      if (data.success) {
        setStep('verify')
        setMessage('Check your email for the 6-digit code!')
      } else {
        setMessage(data.error || 'Failed to send code')
      }
    } catch (err) {
      setLoading(false)
      setMessage('Something went wrong. Please try again.')
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const data = await res.json()
      setLoading(false)

      if (data.success) {
        router.push('/dashboard')
      } else {
        setMessage(data.error || 'Invalid verification code')
      }
    } catch (err) {
      setLoading(false)
      setMessage('Failed to verify code. Please try again.')
    }
  }

  return (
    <div style={{ maxWidth: '360px', margin: '40px auto', padding: '20px' }}>
      {step === 'send' ? (
        <form onSubmit={handleSendOtp}>
          <h2>Sign in to Bluepay</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Sending Code...' : 'Send Verification Code'}
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
            style={{ width: '100%', padding: '10px', marginBottom: '10px', letterSpacing: '4px', textAlign: 'center' }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          <button 
            type="button" 
            onClick={() => setStep('send')} 
            style={{ width: '100%', padding: '8px', marginTop: '8px', background: 'transparent', border: 'none', color: '#666' }}
          >
            Change Email
          </button>
        </form>
      )}
      {message && <p style={{ marginTop: '15px', color: message.includes('Check') ? 'green' : 'red' }}>{message}</p>}
    </div>
  )
}
