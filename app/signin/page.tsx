'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

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
          type: 'signin'
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
        if (typeof window !== 'undefined') {
          const serverName = data.user?.full_name || data.user?.name
          const emailHandle = email.split('@')[0]
          const derivedName = emailHandle.charAt(0).toUpperCase() + emailHandle.slice(1)

          const finalName = serverName || derivedName

          localStorage.setItem('userEmail', email)
          localStorage.setItem('userName', finalName)

          window.dispatchEvent(new Event('storage'))
        }

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
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-3 py-6 sm:px-4 sm:py-8 text-white">
      <div className="w-full max-w-md">
        {step === 'send' ? (
          <div>
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">
                Sign in to PayFlex
              </h1>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Enter your email address to access your account securely.
              </p>
            </div>

            <div className="bg-[#1a1c23] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-4 sm:mb-6 shadow-2xl">
              <form onSubmit={handleSendOtp} className="space-y-4 sm:space-y-6">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#121212] border border-white/10 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base placeholder-white/30 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-lg rounded-xl sm:rounded-2xl shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </form>
            </div>

            <p className="text-center text-white/60 text-xs sm:text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-bold text-blue-400 hover:text-blue-300 underline transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">
                Enter Verification Code
              </h1>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Sent to <span className="font-semibold text-white">{email}</span>
              </p>
            </div>

            <div className="bg-[#1a1c23] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-4 sm:mb-6 shadow-2xl">
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-3 text-center uppercase tracking-wider">
                    Enter 6-digit code
                  </label>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-11 h-12 text-center bg-[#121212] border border-white/10 text-white font-bold rounded-xl text-lg focus:outline-none focus:border-blue-500 shadow-inner"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length < 6}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-lg rounded-xl sm:rounded-2xl shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>

                <button 
                  type="button" 
                  onClick={() => {
                    setStep('send')
                    setOtp(Array(6).fill(''))
                  }} 
                  className="w-full py-2 bg-transparent border-none text-white/50 hover:text-white text-xs sm:text-sm underline transition"
                >
                  Change Email
                </button>
              </form>
            </div>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 border ${message.includes('Check') || message.includes('success') ? 'bg-green-500/20 border-green-500/40 text-green-200' : 'bg-red-500/20 border-red-500/40 text-red-200'}`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-xs sm:text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
