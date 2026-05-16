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
    <div className="min-h-screen bg-[#0000ff] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Content - Optimized for mobile */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md text-center py-8">
        {/* Logo and Brand */}
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            BLUEPAY
          </h1>
          <p className="text-4xl font-bold text-white drop-shadow-lg">
            PRO V30
          </p>
        </div>

        {/* Divider line */}
        <div className="w-full h-1 bg-white mb-8 rounded-full" />

        {/* Lion Image Card - Animated */}
        <div className="w-full bg-white rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="relative h-64 w-full flex items-center justify-center overflow-hidden">
            {/* Lion with sliding animation */}
            <div className="animate-slide-lion absolute">
              <Image
                src="/lion.png"
                alt="Lion"
                width={280}
                height={240}
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="mb-6">
          <h2 className="text-4xl font-italic text-white mb-4 drop-shadow-lg text-center leading-tight">
            Get Your Account Ready And Instantly.
          </h2>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-lg text-white drop-shadow-lg leading-relaxed">
            Get your account ready and instantly start buying, selling airtime and data online and start paying all your bills in cheaper price.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="w-full px-8 py-4 bg-white text-blue-600 font-bold text-xl rounded-2xl shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
        >
          Get Started
        </button>

        {/* Sign In Link */}
        <div className="mt-6">
          <p className="text-white text-sm drop-shadow-lg">
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
