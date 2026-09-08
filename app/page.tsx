'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function WelcomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-between px-6 py-10">
      <div className="w-full flex flex-col items-center pt-8">
        <h1 className="text-3xl font-extrabold text-white tracking-wider mb-1 drop-shadow-lg">
          PayFlex
        </h1>
        <div className="w-12 h-1 bg-white rounded-full"></div>
      </div>

      <div className="w-full max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center my-auto">
        <div className="relative w-44 h-44 mb-6 rounded-2xl overflow-hidden shadow-inner border border-white/20 flex items-center justify-center bg-black">
          <Image
            src="/logo.png"
            alt="PayFlex Logo"
            width={160}
            height={160}
            className="object-contain"
            priority
          />
        </div>
        <p className="text-white text-sm leading-relaxed drop-shadow-md">
          PayFlex allows users to earn extra income, withdraw money, purchase airtime and data, and generate personal PayFlex Code instantly.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4 pb-6">
        <button
          onClick={() => router.push('/signup')}
          className="w-full py-4 bg-white text-black font-bold text-base rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Get Started
        </button>

        <p className="text-center text-sm text-white/80">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-white font-bold underline hover:text-gray-200 transition"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}
