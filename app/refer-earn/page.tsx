'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Copy, Check } from 'lucide-react'

const TRANSACTION_CODE = 'BPC2026_PRO_V30_650'

export default function ReferAndEarnPage() {
  const router = useRouter()
  const [referralCode, setReferralCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [fullName, setFullName] = useState('User')

  useEffect(() => {
    const storedName = sessionStorage.getItem('signupFullName')
    if (storedName) {
      setFullName(storedName)
    }
    // Generate referral code based on user
    setReferralCode(`BPY${storedName?.slice(0, 3).toUpperCase()}${Math.random().toString(36).substring(7).toUpperCase()}`)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Refer & Earn</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Referral Code */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-6">
          <p className="text-sm mb-3 opacity-90">Your Referral Code</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">{referralCode}</p>
            <button
              onClick={handleCopy}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div>
                <p className="font-semibold text-gray-900">Share Your Code</p>
                <p className="text-sm text-gray-600">Share your unique referral code with friends</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
                <p className="font-semibold text-gray-900">Friends Sign Up</p>
                <p className="text-sm text-gray-600">They create an account using your code</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <p className="font-semibold text-gray-900">You Earn</p>
                <p className="text-sm text-gray-600">Get ₦1,000 for each successful referral</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-600 mt-1">Total Referrals</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">₦0</p>
            <p className="text-xs text-gray-600 mt-1">Total Earned</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-600 mt-1">Active Referrals</p>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              const message = `Join BLUEPAY and earn rewards! Use my referral code: ${referralCode}. Download now!`
              if (navigator.share) {
                navigator.share({ title: 'BLUEPAY Referral', text: message })
              } else {
                navigator.clipboard.writeText(message)
                alert('Link copied to clipboard!')
              }
            }}
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
          >
            Share with Friends
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gray-100 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-200">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Transaction Code:</span> {TRANSACTION_CODE}
          </p>
        </div>
      </div>
    </div>
  )
}
