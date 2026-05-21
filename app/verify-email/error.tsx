'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function VerifyEmailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Verify email error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0000ff] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-white mb-4">Verification Error</h1>
        <p className="text-white/80 text-lg mb-2">We&apos;re having trouble verifying your email.</p>
        <p className="text-white/60 text-sm mb-8">{error.message || 'An unexpected error occurred.'}</p>
        
        <div className="flex gap-3 justify-center flex-col">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all"
          >
            Try Again
          </button>
          <Link href="/signup" className="px-6 py-3 bg-blue-400 text-white font-bold rounded-lg hover:bg-blue-500 transition-all text-center">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
