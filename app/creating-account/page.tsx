'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

export default function CreatingAccountPage() {
  const router = useRouter()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('signupEmail')
    const storedName = sessionStorage.getItem('signupFullName')
    if (storedEmail) setEmail(storedEmail)
    if (storedName) setFullName(storedName)
  }, [])

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
          const finalName = fullName || data.user?.full_name || email.split('@')[0]
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-3 py-6 sm:px-4 sm:py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg">
            Verify Your Account
          </h1>
          <p className="text-xs sm:text-sm text-white drop-shadow-lg leading-relaxed">
            We&apos;ve sent a 6-digit verification code to <span className="font-semibold text-white">{email || 'your email'}</span>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-4 sm:mb-6">
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-3 text-center">
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
                    className="w-11 h-12 text-center bg-white text-gray-900 font-bold rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-white shadow-inner"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length < 6}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white text-black font-bold text-sm sm:text-lg rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-xl hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 active:scale-95"
            >
              {loading ? 'Verifying & Creating Account...' : 'VERIFY & COMPLETE'}
            </button>
          </form>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 border ${message.includes('success') || !message.includes('Invalid') ? 'bg-green-500/20 border-green-500/50 text-green-200' : 'bg-red-500/20 border-red-500/50 text-red-200'}`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-xs sm:text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
