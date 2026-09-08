// app/support/page.tsx

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Send, CheckCircle2 } from 'lucide-react'

const SUPPORT_EMAIL = 'Payflexcompany@gmail.com'

export default function SupportPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [category, setCategory] = useState('Transaction Issue')
  const [details, setDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !details) return

    const subject = encodeURIComponent(`Support Request: ${category} - ${fullName}`)
    const body = encodeURIComponent(
      `Full Name: ${fullName}\nCategory: ${category}\n\nDetails:\n${details}`
    )

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-8">
      <header className="sticky top-0 z-40 bg-[#181818] border-b border-[#242424]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-[#242424] rounded-lg transition text-white/80"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-white">Support & Feedback</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Contact Support Card */}
        <div className="bg-[#181818] border border-[#242424] rounded-3xl p-5 shadow-2xl">
          <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Contact Support</h2>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex items-center gap-3 p-3.5 bg-[#121212] border border-[#2c2c2c] rounded-2xl hover:border-[#10B981] transition group"
          >
            <div className="w-10 h-10 bg-[#10B981]/20 text-[#10B981] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#10B981] group-hover:text-white transition">
              <Mail className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-white/50 font-medium">Contact Us via Email</p>
              <p className="text-xs font-bold text-white truncate">{SUPPORT_EMAIL}</p>
            </div>
          </a>
        </div>

        {/* File a Complaint Form */}
        <div className="bg-[#181818] border border-[#242424] rounded-3xl p-5 shadow-2xl">
          <h2 className="text-base font-bold text-white mb-4">File a Complaint</h2>

          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-[#10B981]/20 text-[#10B981] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-white">Redirecting to Email...</h3>
              <p className="text-xs text-white/60">
                Your mail client has been opened to send your complaint directly to {SUPPORT_EMAIL}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#10B981] font-semibold hover:underline mt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name..."
                  className="w-full px-4 py-3 bg-[#121212] border border-[#2c2c2c] rounded-2xl focus:outline-none focus:border-[#10B981] text-xs text-white placeholder-white/30 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">
                  Complaint Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-[#121212] border border-[#2c2c2c] rounded-2xl focus:outline-none focus:border-[#10B981] text-xs text-white transition"
                >
                  <option value="Transaction Issue" className="bg-[#121212] text-white">Transaction Issue</option>
                  <option value="Withdrawal Delay" className="bg-[#121212] text-white">Withdrawal Delay</option>
                  <option value="Account Verification" className="bg-[#121212] text-white">Account Verification</option>
                  <option value="FlexPay Code Issue" className="bg-[#121212] text-white">FlexPay Code Issue</option>
                  <option value="Other" className="bg-[#121212] text-white">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">
                  Complaint Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe your complaint in detail..."
                  className="w-full px-4 py-3 bg-[#121212] border border-[#2c2c2c] rounded-2xl focus:outline-none focus:border-[#10B981] text-xs text-white placeholder-white/30 resize-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 text-xs shadow-lg tracking-wide"
              >
                <Send className="w-4 h-4" />
                Submit Complaint via Gmail
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
