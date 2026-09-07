// app/support/page.tsx

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50 pb-8">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Support & Feedback</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Contact Support Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Contact Support</h2>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500 font-medium">Contact Us via Email</p>
              <p className="text-sm font-bold text-blue-900 truncate">{SUPPORT_EMAIL}</p>
            </div>
          </a>
        </div>

        {/* File a Complaint Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">File a Complaint</h2>

          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900">Redirecting to Email...</h3>
              <p className="text-xs text-gray-500">
                Your mail client has been opened to send your complaint directly to {SUPPORT_EMAIL}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-blue-600 font-semibold hover:underline mt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Complaint Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
                >
                  <option value="Transaction Issue">Transaction Issue</option>
                  <option value="Withdrawal Delay">Withdrawal Delay</option>
                  <option value="Account Verification">Account Verification</option>
                  <option value="FlexPay Code Issue">FlexPay Code Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Complaint Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe your complaint in detail..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm shadow-sm shadow-blue-200"
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
