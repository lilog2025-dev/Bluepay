'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, MessageSquare } from 'lucide-react'

export default function SocialPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <header className="sticky top-0 z-40 bg-[#181818] border-b border-[#2a2a2a]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-[#252525] rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Community Feed</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 flex flex-col items-center justify-center text-center py-12">
        <div className="w-20 h-20 bg-[#00B67A]/20 text-[#00B67A] rounded-3xl flex items-center justify-center mb-6 shadow-sm">
          <Clock className="w-10 h-10 animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-white/60 text-sm max-w-xs mb-8">
          We are building an exciting new social and community experience for PayFlex users. Stay tuned!
        </p>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full max-w-xs bg-[#00B67A] text-black font-semibold py-3 rounded-xl hover:bg-[#00a36d] transition shadow-sm"
        >
          Back to Dashboard
        </button>
      </main>
    </div>
  )
}
