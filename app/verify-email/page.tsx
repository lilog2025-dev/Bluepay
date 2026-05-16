'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [email, setEmail] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('signupEmail')
    if (!storedEmail) {
      router.push('/signup')
      return
    }
    setEmail(storedEmail)
  }, [router])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d{6}$/.test(pastedData)) return

    setOtp(pastedData.split(''))
    inputRefs.current[5]?.focus()
  }

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('')

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: otpCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Verification failed')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      console.error('[v0] Verification error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setCanResend(false)
    setTimeLeft(300)
    setError('')
    setOtp(['', '', '', '', '', ''])

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        setError('Failed to resend OTP')
        return
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('[v0] Resend error:', err)
      setError('Failed to resend OTP')
    }
  }

  return (
    <div className="min-h-screen bg-[#0000ff] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col">
        {/* Title */}
        <h1 className="text-5xl font-bold text-white text-center mb-4">
          Verify Your Email
        </h1>

        {/* Subtitle with email */}
        <p className="text-white text-center text-lg mb-8">
          Enter the 6-digit verification code sent to{' '}
          <span className="font-bold">{email}</span>
        </p>

        {/* OTP Container Card */}
        <div className="bg-[#0000ff] bg-opacity-40 backdrop-blur-md border border-white border-opacity-20 rounded-3xl p-8 mb-8">
          {/* OTP Input Boxes */}
          <div className="flex gap-3 justify-center mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                placeholder=""
                className="w-16 h-16 text-center text-2xl font-bold border-2 border-white border-opacity-40 rounded-2xl bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-30 focus:border-white focus:outline-none focus:border-opacity-100 transition-all"
                autoComplete="off"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyOtp}
            disabled={isLoading || otp.some((d) => !d)}
            className="w-full bg-white text-gray-400 font-bold text-lg py-3 rounded-2xl hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all mb-6"
          >
            {isLoading ? 'Verifying...' : 'VERIFY CODE'}
          </button>

          {/* Timer */}
          <div className="text-center">
            <p className="text-white text-lg">
              Code expires in{' '}
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500 bg-opacity-20 border border-red-400 rounded-lg p-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-500 bg-opacity-20 border border-green-400 rounded-lg p-4 flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
            <p className="text-green-200 text-sm">Email verified successfully!</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-white text-center text-base">
          Didn&apos;t receive the code? Check your spam folder.
        </p>

        {/* Resend OTP */}
        {canResend && (
          <button
            onClick={handleResendOtp}
            className="mt-6 w-full px-6 py-3 bg-white text-[#0000ff] font-bold text-base rounded-2xl hover:bg-gray-50 transition-all"
          >
            Resend Code
          </button>
        )}
      </div>
    </div>
  )
}
