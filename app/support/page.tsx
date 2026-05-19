'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MessageSquare, HelpCircle, AlertCircle } from 'lucide-react'

export default function SupportPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'support' | 'review' | 'complaint'>('support')
  const [message, setMessage] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-2 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Support & Feedback</h1>
          <div className="w-5" />
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-11 z-40">
        <div className="flex px-3">
          <button
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'support'
                ? 'border-[#0000ff] text-[#0000ff]'
                : 'border-transparent text-gray-600'
            }`}
          >
            Support
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'review'
                ? 'border-[#0000ff] text-[#0000ff]'
                : 'border-transparent text-gray-600'
            }`}
          >
            Review
          </button>
          <button
            onClick={() => setActiveTab('complaint')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'complaint'
                ? 'border-[#0000ff] text-[#0000ff]'
                : 'border-transparent text-gray-600'
            }`}
          >
            Complaint
          </button>
        </div>
      </div>

      <main className="px-3 py-3 max-w-2xl mx-auto">
        {activeTab === 'support' && (
          <div className="space-y-3">
            {/* FAQ */}
            <h3 className="font-bold text-gray-900 text-sm mt-3 mb-2">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {[
                { q: 'How do I get my BPC CODE?', a: 'Visit Buy BPC page and follow the steps' },
                { q: 'Why is my payment pending?', a: 'Payments are verified within 24 hours' },
                { q: 'How do I reset my PIN?', a: 'Go to security settings to reset PIN' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex gap-2">
                    <HelpCircle className="w-5 h-5 text-[#0000ff] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{item.q}</p>
                      <p className="text-xs text-gray-600 mt-1">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Chat */}
            <div className="bg-[#0000ff]/10 rounded-lg p-3 border border-[#0000ff]/20 mt-4">
              <p className="text-xs text-gray-900 mb-2 font-semibold">Need more help?</p>
              <button className="w-full bg-[#0000ff] text-white font-bold py-2 rounded-lg hover:opacity-90 transition text-sm">
                Start Live Chat
              </button>
            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 mt-3">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Share Your Feedback</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  How would you rate BLUEPAY?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className="text-2xl hover:scale-110 transition"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Your Feedback
                </label>
                <textarea
                  placeholder="Tell us what you think..."
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
                />
              </div>

              <button className="w-full bg-[#0000ff] text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition text-sm">
                Submit Review
              </button>
            </div>
          </div>
        )}

        {activeTab === 'complaint' && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 mt-3">
            <h3 className="font-bold text-gray-900 text-sm mb-3">File a Complaint</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Complaint Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff]">
                  <option>Transaction Issue</option>
                  <option>Technical Issue</option>
                  <option>Account Issue</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Complaint Details
                </label>
                <textarea
                  placeholder="Describe your complaint..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
                />
              </div>

              <button className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition text-sm">
                Submit Complaint
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
