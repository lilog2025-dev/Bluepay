'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail } from 'lucide-react'

export default function SupportPage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const supportEmail = 'supportPayFlexpro.com@gmail.com'

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-3 px-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Support & Feedback</h1>
          <div className="w-5" />
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Contact Support Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 text-sm">Contact Support</h2>
          
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition text-left w-full cursor-pointer"
            >
              <div className="p-2.5 bg-blue-50 text-[#0000ff] rounded-xl shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-medium">Contact Us via Email</p>
                <p className="font-semibold text-gray-900 text-sm truncate">{copied ? 'Email Copied!' : supportEmail}</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
