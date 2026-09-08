'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Check, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { sendDebitAlert, generateTransactionId, getCurrentDateTime } from '@/lib/debit-alert'
import { getBalance, deductBalance, addTransaction } from '@/lib/balance-store'

import { createClient } from '@supabase/supabase-js'

const CORRECT_PayFlexCode_CODE = 'PayFlexCode2026_PRO_V30_650'

export default function BettingPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [userBettingId, setUserBettingId] = useState('')
  const [, setUserId] = useState('')
  const [, setBalance] = useState(250000) // Demo balance
  const [PayFlexCodeCode, setPayFlexCodeCode] = useState('')
  const [showPayFlexCodeCode, setShowPayFlexCodeCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [PayFlexCodeError, setPayFlexCodeError] = useState('')
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

  React.useEffect(() => {
    if (typeof window === "undefined") return
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
            .select('full_name')
            .eq('id', session.user.id)
            .single()
          if (profile?.full_name) setFullName(profile.full_name)
        }
      } catch (err) {
        setFullName(sessionStorage.getItem('signupFullName') || 'PayFlex User')
        setUserEmail(sessionStorage.getItem('signupEmail') || '')
      }
    }
    loadUserData()

    // Load balance from unified store and listen for changes
    setBalance(getBalance())
    const handleBalanceChange = () => setBalance(getBalance())
    window.addEventListener('balanceChange', handleBalanceChange)
    
    return () => window.removeEventListener('balanceChange', handleBalanceChange)
  }, [])

  const handleBet = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPlatform) {
      alert('Please select a betting platform')
      return
    }

    if (!userBettingId.trim()) {
      alert('Please enter your User ID')
      return
    }
    
    if (!amount) {
      alert('Please enter a bet amount')
      return
    }
    
    if (!PayFlexCodeCode) {
      setPayFlexCodeError('Please enter PayFlexCode CODE')
      return
    }
    
    if (PayFlexCodeCode !== CORRECT_PayFlexCode_CODE) {
      setPayFlexCodeError('Wrong Bank Processing Code (PayFlexCode CODE). Kindly get the correct code to proceed with the transaction.')
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const betAmount = parseFloat(amount)
      const transactionId = generateTransactionId()
      
      // Send debit alert email
      await sendDebitAlert({
        email: userEmail,
        full_name: fullName,
        transaction_type: 'Betting',
        amount: betAmount,
        recipient_name: selectedPlatform,
        recipient_account_number: userBettingId,
        recipient_bank_name: 'Betting Platform',
        transaction_id: transactionId,
        transaction_date: getCurrentDateTime(),
      })

      // Update demo balance in unified store
      const newBalance = deductBalance(betAmount)
      setBalance(newBalance)

      // Add transaction to unified store
      addTransaction({
        type: 'betting',
        amount: betAmount,
        status: 'success',
        description: `Betting - ${selectedPlatform}`,
      })
      
      setSuccess(true)
      // Show success for 2 seconds then navigate to dashboard
      setTimeout(() => {
        // Dispatch events to notify dashboard of updates
        window.dispatchEvent(new Event('balanceChange'))
        window.dispatchEvent(new Event('transactionsChange'))
        // Navigate to dashboard
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('[v0] Bet error:', error)
      alert('Transaction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-[#10B981]" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Bet Placed Successfully!</h1>
          
          {/* Details */}
          <div className="bg-[#181818] border border-[#242424] rounded-3xl p-5 space-y-3 text-left mb-4 shadow-2xl">
            <div className="flex justify-between text-xs">
              <span className="text-white/65">User Name</span>
              <span className="font-bold text-white">{fullName || 'Guest User'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/65">Transaction Date & Time</span>
              <span className="font-semibold text-white/80 text-[10px]">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/65">Platform</span>
              <span className="font-semibold text-white">{selectedPlatform}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/65">Bet Amount</span>
              <span className="font-bold text-[#10B981]">₦{parseInt(amount).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-2xl shadow-lg transition tracking-wide"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                setSuccess(false)
                setSelectedPlatform('')
                setUserBettingId('')
                setAmount('')
                setPayFlexCodeError('')
              }}
              className="w-full bg-[#121212] border border-[#2c2c2c] text-white font-bold py-3.5 rounded-2xl hover:bg-[#242424] transition text-xs tracking-wide"
            >
              Place Another Bet
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-8">
      <header className="sticky top-0 z-40 bg-[#181818] border-b border-[#242424]">
        <div className="flex items-center gap-3 max-w-sm mx-auto px-4 py-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-[#242424] rounded-lg text-white/80 transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-white">Place Bet</h1>
        </div>
      </header>
      <div className="max-w-sm mx-auto px-4 py-6">
        <form onSubmit={handleBet} className="bg-[#181818] border border-[#242424] rounded-3xl p-5 space-y-4 shadow-2xl">
          <div>
            <label className="block text-xs font-semibold text-white/65 uppercase tracking-wider mb-2">Select Betting Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#121212] border border-[#2c2c2c] rounded-2xl focus:outline-none focus:border-[#10B981] text-xs font-medium text-white transition"
              required
            >
              <option value="" className="bg-[#121212] text-white">Choose platform</option>
              {platforms.map((platform) => (
                <option key={platform} value={platform} className="bg-[#121212] text-white">{platform}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/65 uppercase tracking-wider mb-2">Your User ID</label>
            <input
              type="text"
              value={userBettingId}
              onChange={(e) => setUserBettingId(e.target.value)}
              placeholder="Enter your betting platform User ID"
              className="w-full px-4 py-3.5 bg-[#121212] border border-[#2c2c2c] rounded-2xl focus:outline-none focus:border-[#10B981] text-xs text-white placeholder-white/30 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/65 uppercase tracking-wider mb-2">Bet Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter bet amount"
              className="w-full px-4 py-3.5 bg-[#121212] border border-[#2c2c2c] rounded-2xl focus:outline-none focus:border-[#10B981] text-xs text-white placeholder-white/30 transition"
              required
              min="100"
            />
          </div>

          {/* PayFlexCode CODE Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-white/65 uppercase tracking-wider">
                INPUT PAYFLEX CODE
              </label>
              <button
                type="button"
                onClick={() => router.push('/buy-payflex-code')}
                className="text-xs text-[#10B981] font-bold hover:underline"
              >
                Buy PayFlex Code
              </button>
            </div>
            <div className="relative">
              <input
                type={showPayFlexCodeCode ? 'text' : 'password'}
                value={PayFlexCodeCode}
                onChange={(e) => {
                  setPayFlexCodeCode(e.target.value)
                  setPayFlexCodeError('')
                }}
                placeholder="Enter PayFlexCode Code"
                className="w-full px-4 py-3.5 bg-[#121212] border border-[#2c2c2c] rounded-2xl focus:outline-none focus:border-[#10B981] pr-12 text-xs text-white placeholder-white/30 transition"
                maxLength={CORRECT_PayFlexCode_CODE.length}
              />
              <button
                type="button"
                onClick={() => setShowPayFlexCodeCode(!showPayFlexCodeCode)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
              >
                {showPayFlexCodeCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {PayFlexCodeError && (
            <div className="flex gap-3 p-3 bg-red-500/20 border border-red-500/40 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-200">{PayFlexCodeError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-2xl shadow-lg transition disabled:opacity-50 mt-4 text-xs tracking-wide"
          >
            {loading ? 'Processing...' : 'Place Bet'}
          </button>
        </form>
      </div>
    </div>
  )
}
