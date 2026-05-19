'use client'

import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'

interface CountdownProps {
  seconds: number
  onComplete: () => void
  message?: string
}

export function Countdown({ seconds, onComplete, message = 'Processing...' }: CountdownProps) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (remaining <= 0) {
      onComplete()
      return
    }

    const timer = setInterval(() => {
      setRemaining(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [remaining, onComplete])

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader className="w-12 h-12 text-[#0000ff] animate-spin mb-4" />
      <p className="text-lg font-semibold text-gray-900 mb-2">{message}</p>
      <p className="text-sm text-gray-500">
        Redirecting in {remaining} second{remaining !== 1 ? 's' : ''}...
      </p>
    </div>
  )
}
