'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Check, Eye, EyeOff } from 'lucide-react'
import { sendDebitAlert, generateTransactionId, getCurrentDateTime } from '@/lib/debit-alert'
import { createClient } from '@supabase/supabase-js'
import { subscribeToBalance } from '@/lib/fintech-utils'

export default function BettingPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'confirm' | 'countdown' | 'success'>('form')
  const [amount, setAmount] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [userId, setUserId] = useState('')
  const [bpcCode, setBpcCode] = useState('')
  const [showBpcCode, setShowBpcCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [transactionId, setTransactionId] = useState('')
  const [fullName, setFullName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const platforms = [
    'BET9JA',
    'SPORTYBET',
    'NAIRABET',
    'BETKING',
    '1XBET',
    'MSPORT',
    'BANGBET',
    'MERRYBET',
    'SUPABET',
    'WESTERNBET',
  ]

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUserId(session.user.id)
          setUserEmail(session.user.email || '')
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, balance')
            .eq('id', session.user.id)
            .single()
          if (profile?.full_name) setFullName(profile.full_name)
          if (profile?.balance) {
            setBalance(profile.balance)
            
            // Subscribe to balance changes in realtime
            subscribeToBalance(session.user.id, (newBalance) => {
              setBalance(newBalance)
            })
          }
        }
      } catch (err) {
        setFullName(sessionStorage.getItem('signupFullName') || 'BLUEPAY User')
        setUserEmail(sessionStorage.getItem('signupEmail') || '')
      }
    }
    loadUserData()
  }, [])

  useEffect(() => {
    if (step === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (step === 'countdown' && countdown === 0 && step === 'countdown') {
      setStep('success')
    }
  }, [countdown, step])

  const handlePlaceBet = async () => {
    if (!selectedPlatform) {
      alert('Please select a betting platform')
      return
    }
    if (!userId.trim()) {
      alert('Please enter your User ID')
      return
    }
    if (!amount) {
      alert('Please enter a bet amount')
      return
    }
    if (!bpcCode.trim()) {
      alert('Please enter your BPC CODE')
      return
    }
    
    setStep('confirm')
  }

  const handleProceed = async () => {
    setCountdown(7)
    setStep('countdown')

    // Send debit alert
    const txId = generateTransactionId()
    setTransactionId(txId)

    await sendDebitAlert({
      email: userEmail,
      full_name: fullName,
      transaction_type: 'Betting',
      amount: parseFloat(amount),
      recipient_name: selectedPlatform,
      recipient_account_number: userId,
      recipient_bank_name: 'Betting Platform',
      transaction_id: txId,
      transaction_date: getCurrentDateTime(),
    })
  }

  // Success Page
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 pb-8">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Bet Placed Successfully!</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 pt-8">
          <div className="bg-gradient-to-b from-green-50 to-blue-50 rounded-2xl p-6 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bet Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">Your betting transaction has been processed.</p>

            <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3 mb-6 text-left">
              <div>
                <p className="text-xs text-gray-600 mb-1">Betting Platform</p>
                <p className="font-bold text-gray-900">{selectedPlatform}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">User ID</p>
                <p className="font-bold text-gray-900">{userId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Amount</p>
                <p className="font-bold text-[#0000ff]">NGN {parseFloat(amount).toLocaleString()}.00</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Transaction ID</p>
                <p className="font-mono font-bold text-gray-900 text-xs">{transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Date & Time</p>
                <p className="font-bold text-gray-900 text-xs">{getCurrentDateTime()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Full Name</p>
                <p className="font-bold text-gray-900">{fullName}</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-[#0000ff] text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Countdown Screen
  if (step === 'countdown') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-6xl font-bold text-[#0000ff] mb-4 tabular-nums">{countdown}</div>
          <p className="text-gray-600 text-lg">Processing your betting transaction...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we place your bet</p>
        </div>
      </div>
    )
  }

  // Confirm Details Screen
  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-gray-50 pb-8">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            <button onClick={() => setStep('form')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Confirm Details</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 pt-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4 mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Betting Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between pb-3 border-b border-gray-200">
                <span className="text-gray-600">Platform</span>
                <span className="font-bold text-gray-900">{selectedPlatform}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-200">
                <span className="text-gray-600">User ID</span>
                <span className="font-bold text-gray-900">{userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-[#0000ff]">NGN {parseFloat(amount).toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setStep('form')}
              className="w-full bg-gray-200 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-300 transition"
            >
              EDIT
            </button>
            <button
              onClick={handleProceed}
              className="w-full bg-[#0000ff] text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
            >
              PROCEED
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Form Screen
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 max-w-2xl mx-auto px-4 py-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Place Bet</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Available Balance */}
        <div className="bg-gradient-to-r from-[#0000ff] to-blue-600 rounded-xl p-4 text-white mb-6">
          <p className="text-white/70 text-xs mb-1">Available Balance</p>
          <h2 className="text-2xl font-bold">NGN {balance.toLocaleString()}.00</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Select Betting Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
              required
            >
              <option value="">Choose platform</option>
              {platforms.map((platform) => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Your User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your betting platform User ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Bet Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter bet amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
              required
              min="100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">BPC CODE</label>
            <div className="relative">
              <input
                type={showBpcCode ? 'text' : 'password'}
                value={bpcCode}
                onChange={(e) => setBpcCode(e.target.value)}
                placeholder="Enter your BPC CODE"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowBpcCode(!showBpcCode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showBpcCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handlePlaceBet}
            disabled={loading}
            className="w-full bg-[#0000ff] text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition mt-6"
          >
            {loading ? 'Placing Bet...' : 'Place Bet'}
          </button>
        </div>
      </div>
    </div>
  )
}
