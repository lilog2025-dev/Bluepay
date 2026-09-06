'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [step, setStep] = useState<'send' | 'verify'>('send')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          type: 'signin' // Instructs backend NOT to create account if user doesn't exist
        }),
      })

      const data = await res.json()
      setLoading(false)

      if (data.success) {
        setStep('verify')
        setMessage('Check your email for the 6-digit code!')
      } else {
        setMessage(data.error || 'Account not found. Please sign up first.')
      }
    } catch (err) {
      setLoading(false)
      setMessage('Something went wrong. Please try again.')
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    // Handle pasting a 6-digit code
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('')
      const newOtp = [...otp]
      pastedData.forEach((char, i) => {
        newOtp[i] = char
      })
      setOtp(newOtp)
      const nextFocus = Math.min(pastedData.length, 5)
      inputRefs.current[nextFocus]?.focus()
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-advance focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const code = otp.join('')

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
    <div style={{ maxWidth: '380px', margin: '40px auto', padding: '20px' }}>
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
          
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '15px' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: '42px',
                  height: '48px',
                  fontSize: '20px',
                  textAlign: 'center',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                }}
              />
            ))}
          </div>

          <button type="submit" disabled={loading || otp.join('').length < 6} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          <button 
            type="button" 
            onClick={() => {
              setStep('send')
              setOtp(Array(6).fill(''))
            }} 
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
