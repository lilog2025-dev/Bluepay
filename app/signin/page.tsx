'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { validateEmail } from '@/lib/utils'

export default function SigninPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')
    setSuccessMessage('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Send OTP for signin
      const otpResponse = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const otpData = await otpResponse.json()

      if (!otpResponse.ok) {
        setGeneralError(otpData.error || 'Failed to send verification code')
        setIsLoading(false)
        return
      }

      // Store email for verification
      sessionStorage.setItem('signinEmail', email)
      setSuccessMessage('Verification code sent to your email!')
      
      // Redirect to verification
      setTimeout(() => {
        router.push('/verify-email')
      }, 1500)
    } catch (error) {
      console.error('[v0] Signin error:', error)
      setGeneralError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-[#0000ff] flex flex-col items-center justify-start pt-8 px-4">
      <div className="w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            BLUEPAY
          </h1>
          <p className="text-4xl font-bold text-white drop-shadow-lg mb-6">
            PRO V30
          </p>
          <div className="w-full h-1 bg-white rounded-full" />
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-3xl p-8 mb-6 shadow-2xl">
          {/* Title */}
          <h2 className="text-4xl font-bold text-[#0000ff] text-center mb-2">
            Sign In
          </h2>

          {/* Subtitle */}
          <p className="text-center text-gray-600 text-base mb-6">
            Enter your email to receive a verification code
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Label */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: '' })
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0000ff] focus:border-transparent transition-all"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* General Error */}
            {generalError && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-red-700 text-sm">
                {generalError}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-green-700 text-sm">
                {successMessage}
              </div>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-[#0000ff] text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 active:scale-95"
            >
              {isLoading ? 'Sending Code...' : 'Continue'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-700 text-base mt-6">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-bold text-[#0000ff] hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="w-full px-6 py-4 bg-white text-[#0000ff] font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>
    </div>
  )
}
