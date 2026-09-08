// app/page.tsx

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0000ff] flex flex-col items-center justify-between px-6 py-12 text-white">
      <div className="flex flex-col items-center mt-6">
        <h1 className="text-3xl font-extrabold tracking-tight">PayFlex</h1>
        <div className="w-12 h-1 bg-white/60 rounded-full mt-2" />
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl my-6 flex flex-col items-center">
        <div className="w-full h-48 relative mb-6 flex items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?q=80&w=600&auto=format&fit=crop"
            alt="PayFlex Lion"
            fill
            className="object-contain rounded-2xl"
            priority
          />
        </div>

        <p className="text-gray-600 text-center text-xs leading-relaxed">
          PayFlex allows users to earn extra income, withdraw money, purchase airtime and data, and generate personal PayFlex Code instantly.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4 mb-4">
        <button
          onClick={() => router.push('/signup')}
          className="w-full bg-white text-[#0000ff] font-bold py-3.5 rounded-2xl shadow-lg hover:bg-gray-100 transition text-sm"
        >
          Get Started
        </button>

        <p className="text-center text-xs text-white/80">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/signin')}
            className="underline font-semibold text-white hover:opacity-80"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}
