// app/social/page.tsx

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, MessageSquare } from 'lucide-react'

export default function SocialPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Community Feed</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 flex flex-col items-center justify-center text-center py-12">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
          <Clock className="w-10 h-10 animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-500 text-sm max-w-xs mb-8">
          We are building an exciting new social and community experience for PayFlex users. Stay tuned!
        </p>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full max-w-xs bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition shadow-sm"
        >
          Back to Dashboard
        </button>
      </main>
    </div>
  )
}
