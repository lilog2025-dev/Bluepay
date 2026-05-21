'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-4">Oops!</h1>
        <p className="text-white text-lg mb-6">Something went wrong on this page.</p>
        <p className="text-white/80 text-sm mb-8">{error.message || 'An unexpected error occurred.'}</p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-400 text-white font-bold rounded-lg hover:bg-blue-500 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
