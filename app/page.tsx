'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function WelcomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGetStarted = () => {
    router.push('/signup')
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-500 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0000ff] via-[#0000ff] to-[#4f46e5] opacity-90" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-8">
        {/* Logo and Brand */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            BLUEPAY
          </h1>
          <p className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            DIGITAL
          </p>
        </div>

        {/* Animated scrolling text */}
        <div className="w-full max-w-md mb-12 overflow-hidden bg-white bg-opacity-10 backdrop-blur-sm rounded-lg py-3 px-4">
          <div className="animate-slide-left whitespace-nowrap text-lg md:text-xl font-semibold text-white drop-shadow-lg">
            Smart Payments • Airtime • Data • Bills • Transfers
          </div>
        </div>

        {/* Headline */}
        <div className="max-w-xl mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Get Your Account Ready Instantly
          </h2>
        </div>

        {/* Description */}
        <div className="max-w-2xl mb-12">
          <p className="text-lg md:text-xl text-white drop-shadow-lg leading-relaxed">
            Create your account and enjoy secure transfers, airtime purchases, bill payments and digital financial services.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 md:px-12 md:py-5 bg-white text-blue-600 font-bold text-lg md:text-xl rounded-lg shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
        >
          GET STARTED
        </button>

        {/* Sign In Link */}
        <div className="mt-8">
          <p className="text-white text-sm md:text-base drop-shadow-lg">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="font-bold underline hover:text-gray-100 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Floating elements for design */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-white opacity-5 rounded-full blur-2xl animate-pulse-soft" />
      <div className="absolute bottom-20 left-5 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl animate-pulse-soft" />
    </div>
  )
}
