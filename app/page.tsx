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
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-between px-6 py-10 text-white">
      <div className="w-full flex flex-col items-center pt-8">
        <h1 className="text-3xl font-extrabold tracking-wider mb-1 text-white">
          PayFlex
        </h1>
        <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
      </div>

      <div className="w-full max-w-sm bg-[#1a1c23] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center my-auto">
        <div className="relative w-44 h-44 mb-6 rounded-2xl overflow-hidden shadow-inner border border-white/10 flex items-center justify-center bg-black">
          <Image
            src="/3FB9F6B0-1D1D-4DFA-AEAA-6315916251DC.png"
            alt="PayFlex Logo"
            width={160}
            height={160}
            className="object-contain"
            priority
          />
        </div>
        <p className="text-sm font-medium leading-relaxed text-white/70">
          PayFlex allows users to earn extra income, withdraw money, purchase airtime and data, and generate personal PayFlex Code instantly.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4 pb-6">
        <button
          onClick={() => router.push('/signup')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base rounded-2xl shadow-xl transition-all duration-300"
        >
          Get Started
        </button>

        <p className="text-center text-sm text-white/60">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/signin')}
            className="text-blue-400 font-bold underline hover:text-blue-300 transition"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}
