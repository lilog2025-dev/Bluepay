'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Check, Share2, Users, TrendingUp } from 'lucide-react'

export default function ReferAndEarnPage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const referralCode = 'BLUEPAY_USER_2026'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const referrals = [
    { name: 'John Doe', joinDate: '2 days ago', status: 'Active', earnings: 5000 },
    { name: 'Jane Smith', joinDate: '1 week ago', status: 'Active', earnings: 7500 },
    { name: 'Mike Johnson', joinDate: '10 days ago', status: 'Pending', earnings: 0 },
  ]

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#0000ff] hover:opacity-80 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Refer & Earn</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Referral Summary */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-lg mb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-white/70 text-sm mb-1">Total Referrals</p>
              <h2 className="text-3xl font-bold">3</h2>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Total Earnings</p>
              <h2 className="text-3xl font-bold">₦12,500</h2>
            </div>
          </div>
          <p className="text-sm text-white/80">
            Earn ₦5,000 for each successful referral when your friend signs up and completes their first transaction!
          </p>
        </div>

        {/* Referral Code Section */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border-2 border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Your Referral Code</h3>
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="flex-1 px-4 py-3 bg-white border-2 border-[#0000ff] rounded-xl font-mono text-[#0000ff] font-bold"
            />
            <button
              onClick={copyToClipboard}
              className={`p-3 rounded-xl font-semibold transition-all ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-[#0000ff] text-white hover:opacity-90'
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button className="py-3 bg-blue-500 text-white rounded-lg font-semibold hover:opacity-90 text-sm">
              Facebook
            </button>
            <button className="py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:opacity-90 text-sm">
              Twitter
            </button>
            <button className="py-3 bg-green-500 text-white rounded-lg font-semibold hover:opacity-90 text-sm">
              WhatsApp
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
          <h3 className="font-bold text-gray-900 mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Share Your Code</p>
                <p className="text-gray-600 text-xs">Share your referral code with friends and family</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Friend Signs Up</p>
                <p className="text-gray-600 text-xs">They create an account using your referral code</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">First Transaction</p>
                <p className="text-gray-600 text-xs">They complete their first transaction on BLUEPAY</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                ✓
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Earn ₦5,000</p>
                <p className="text-gray-600 text-xs">Instant credit to your BLUEPAY wallet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Referrals */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Referrals</h3>
        <div className="space-y-3">
          {referrals.map((ref, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border-2 border-gray-200">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold">
                  {ref.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{ref.name}</p>
                  <p className="text-xs text-gray-600">{ref.joinDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${ref.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {ref.status}
                </p>
                <p className="text-[#0000ff] font-bold">₦{ref.earnings.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bonus Section */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
          <h3 className="font-bold text-gray-900 mb-2">Special Bonus</h3>
          <p className="text-gray-600 text-sm mb-4">
            Refer 5 friends and get a ₦10,000 bonus! Refer 10 friends and unlock premium features!
          </p>
          <div className="flex gap-2">
            <Users className="w-5 h-5 text-yellow-600" />
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
        </div>
      </main>
    </div>
  )
}
