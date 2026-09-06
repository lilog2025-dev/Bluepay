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
    <div className="min-h-screen bg-gradient-to-b from-[#0000ff] to-[#3366ff] flex flex-col items-center justify-center pt-6 sm:pt-8 px-3 sm:px-4 relative overflow-hidden">
      {/* Content - Premium fintech layout */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm text-center">
        {/* Logo and Brand - Shifted upward */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 drop-shadow-lg tracking-tight">
            PayFlex
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg tracking-wide">
            PRO V30
          </p>
        </div>

        {/* Divider line */}
        <div className="w-20 h-1 bg-white/60 mb-6 sm:mb-8 rounded-full" />

        {/* Lion Image Card - Premium with right-to-left animation */}
        <div className="w-full bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-2xl">
          <div className="relative h-48 sm:h-64 w-full flex items-center justify-center overflow-hidden rounded-2xl">
            {/* Lion with slow continuous right-to-left animation */}
            <div className="animate-lion-slide absolute">
              <Image
                src="/lion-asset.jpg"
                alt="Lion mascot"
                width={280}
                height={220}
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            {/* Duplicate for seamless loop */}
            <div className="animate-lion-slide absolute -left-full">
              <Image
                src="/lion-asset.jpg"
                alt="Lion mascot"
                width={280}
                height={220}
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Premium Description Text */}
        <div className="mb-6 sm:mb-8 px-2">
          <p className="text-sm sm:text-base text-white drop-shadow-lg leading-relaxed font-light">
            PayFlex PRO V30 allows users to earn extra income, withdraw money, purchase airtime and data, share with friends, families and generate personal PayFlex Code CODE instantly.
          </p>
        </div>

        {/* Premium Get Started Button */}
        <button
          onClick={handleGetStarted}
          className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#0000ff] font-bold text-sm sm:text-base rounded-2xl shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95 mb-4 sm:mb-6"
        >
          Get Started
        </button>

        {/* Sign In Link */}
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
  )
}
