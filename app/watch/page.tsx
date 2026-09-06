'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, LayoutDashboard } from 'lucide-react'

export default function WatchPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between pb-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-3 px-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Watch & Learn</h1>
          <div className="w-5" />
        </div>
      </header>

      {/* Main Coming Soon Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center my-auto">
        <div className="w-20 h-20 bg-blue-50 text-[#0000ff] rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Clock className="w-10 h-10 animate-pulse" />
        </div>

        <span className="bg-blue-100 text-[#0000ff] font-bold text-xs px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
          Feature In Progress
        </span>

        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          COMING SOON
        </h2>

        <p className="text-xs text-gray-500 max-w-xs mb-8 leading-relaxed">
          We are upgrading our video content platform. This section will be available in an upcoming update!
        </p>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full max-w-xs bg-[#0000ff] text-white font-bold py-3 px-6 rounded-2xl shadow-md hover:bg-blue-700 active:scale-95 transition flex items-center justify-center gap-2 text-sm"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>GO BACK TO DASHBOARD</span>
        </button>
      </main>

      {/* Footer Branding */}
      <footer className="text-center py-2">
        <p className="text-[10px] text-gray-400 font-medium">PayFlex DIGITAL • 2026</p>
      </footer>
    </div>
  )
}

