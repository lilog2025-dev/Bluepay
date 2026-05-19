'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MessageCircle, MessageSquareDot } from 'lucide-react'

export default function GroupPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Community & Support</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">
        {/* Intro Section */}
        <div className="bg-gradient-to-r from-blue-50 to-[#0000ff]/5 rounded-2xl p-4 border border-[#0000ff]/20 mb-6">
          <h2 className="font-bold text-gray-900 text-lg mb-2">Join Our Community</h2>
          <p className="text-gray-600 text-sm">Connect with other BLUEPAY users, share tips, and get support from our team.</p>
        </div>

        {/* Community Buttons */}
        <div className="space-y-4">
          {/* Telegram Channel */}
          <a
            href="https://t.me/bluepay2"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-500 hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquareDot className="w-7 h-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-0.5">Join Telegram Channel</h3>
                <p className="text-xs text-gray-600">Get latest updates, tips, and community discussions</p>
              </div>
              <div className="text-[#0000ff] font-bold text-2xl">→</div>
            </div>
          </a>

          {/* WhatsApp Support */}
          <a
            href="https://wa.me/2347078434086?text=Hello%20BLUEPAY%20Support%2C%20I%20need%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-green-500 hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-0.5">WhatsApp Support Group</h3>
                <p className="text-xs text-gray-600">Direct support from our team and community members</p>
              </div>
              <div className="text-green-600 font-bold text-2xl">→</div>
            </div>
          </a>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">Why Join?</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="text-[#0000ff] font-bold text-lg mt-0.5">✓</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Get Real-time Support</p>
                <p className="text-xs text-gray-600">Connect with support team and community</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="text-[#0000ff] font-bold text-lg mt-0.5">✓</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Share Tips & Strategies</p>
                <p className="text-xs text-gray-600">Learn from other BLUEPAY users</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="text-[#0000ff] font-bold text-lg mt-0.5">✓</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Exclusive Updates</p>
                <p className="text-xs text-gray-600">Be first to know about new features</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
