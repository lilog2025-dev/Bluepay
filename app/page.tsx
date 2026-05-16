'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

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
    <div className="min-h-screen bg-[#0000ff] flex flex-col items-center justify-start pt-6 sm:pt-8 px-3 sm:px-4 relative overflow-hidden">
      {/* Content - Compact mobile-optimized layout */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm text-center">
        {/* Logo and Brand */}
        <div className="mb-3">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-0.5 sm:mb-1 drop-shadow-lg">
            BLUEPAY
          </h1>
          <p className="text-2xl sm:text-4xl font-bold text-white drop-shadow-lg">
            PRO V30
          </p>
        </div>

        {/* Divider line */}
        <div className="w-full h-0.5 sm:h-1 bg-white mb-4 sm:mb-6 rounded-full" />

        {/* Lion Image Card - Animated with pure white background */}
        <div className="w-full bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-2xl">
          <div className="relative h-32 sm:h-48 w-full flex items-center justify-center overflow-hidden">
            {/* Lion with sliding animation */}
            <div className="animate-slide-lion absolute">
              <Image
                src="/lion.png"
                alt="Lion mascot"
                width={180}
                height={150}
                className="object-contain sm:w-auto sm:h-auto"
                priority
              />
            </div>
          </div>
        </div>

        {/* Description - Curved/Soft Italic Styling */}
        <div className="mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-white drop-shadow-lg leading-relaxed italic font-light">
            Purchase airtime and data, transfer money, pay bills, and earn rewards instantly.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="w-full px-4 sm:px-6 py-3 sm:py-3 bg-white text-[#0000ff] font-bold text-sm sm:text-lg rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
        >
          Get Started
        </button>

        {/* Sign In Link */}
        <div className="mt-3 sm:mt-4">
          <p className="text-white text-xs sm:text-sm drop-shadow-lg">
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
    </div>
  )
}
