'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Check, AlertCircle, Eye, EyeOff, Loader } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { sendDebitAlert, generateTransactionId, getCurrentDateTime } from '@/lib/debit-alert'
import { deductBalance, recordTransaction, subscribeToBalance } from '@/lib/fintech-utils'

export default function WithdrawPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'countdown1' | 'confirm' | 'countdown2' | 'success'>('form')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [amount, setAmount] = useState('')
  const [bpcCode, setBpcCode] = useState('')
  const [showBpcCode, setShowBpcCode] = useState(false)
  const [userId, setUserId] = useState('')
  const [fullName, setFullName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [transactionId, setTransactionId] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [balance, setBalance] = useState(0)

  const CORRECT_BPC_CODE = 'BPC2026_PRO_V30_650'
  const banks = ['Access Bank', 'Zenith Bank', 'Guaranty Trust Bank', 'First Bank', 'UBA', 'FCMB', 'Stanbic IBTC', 'Fidelity Bank']

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && step === 'countdown1') {
      setStep('confirm')
    } else if (countdown === 0 && step === 'countdown2') {
      setStep('success')
    }
  }, [countdown, step])

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
        if (profile) {
          setFullName(profile.full_name || 'BLUEPAY User')
          setBalance(profile.balance || 0)
          
          // Subscribe to balance changes in realtime
          subscribeToBalance(session.user.id, (newBalance) => {
            setBalance(newBalance)
          })
        }
      }
    } catch (err) {
      console.error('[v0] Error loading user data:', err)
    }
  }

  const validateForm = (): boolean => {
    if (!bankName) {
      setError('Please select a bank')
      return false
    }
    if (!accountNumber || accountNumber.length < 10) {
      setError('Please enter a valid account number')
      return false
    }
    if (!accountName.trim()) {
      setError('Please enter account name')
      return false
    }
    if (!amount || parseFloat(amount) < 1000) {
      setError('Minimum withdrawal is ₦1,000')
      return false
    }
    if (parseFloat(amount) > balance) {
      setError('Insufficient balance')
      return false
    }
    if (bpcCode !== CORRECT_BPC_CODE) {
      setError('Invalid BPC CODE')
      return false
    }
    return true
  }

  const handleContinue = () => {
    setError('')
    if (validateForm()) {
      setCountdown(7)
      setStep('countdown1')
    }
  }

  const handleProceed = async () => {
    setLoading(true)
    setError('')
    setCountdown(7)
    setStep('countdown2')

    try {
      const txId = generateTransactionId()
      const sId = `SESSION${Date.now()}`
      setTransactionId(txId)
      setSessionId(sId)

      // Send debit alert
      await sendDebitAlert({
        email: userEmail,
        full_name: fullName,
        transaction_type: 'Withdrawal',
        amount: parseFloat(amount),
        recipient_name: accountName,
        recipient_account_number: accountNumber,
        recipient_bank_name: bankName,
        transaction_id: txId,
        transaction_date: getCurrentDateTime(),
      })

      // Deduct balance
      await deductBalance(userId, parseFloat(amount))

      // Record transaction
      await recordTransaction(userId, {
        type: 'withdrawal',
        amount: parseFloat(amount),
        provider: bankName,
        recipient: accountName,
        description: `Withdrawal to ${accountName}`,
        sessionId: sId,
      })
    } catch (err) {
      console.error('[v0] Error processing withdrawal:', err)
      setError('Error processing withdrawal')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-xl font-bold text-gray-900">Withdrawal Successful!</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 pt-8">
          <div className="bg-gradient-to-b from-green-50 to-blue-50 rounded-2xl p-6 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdrawal Successful!</h2>
            <p className="text-gray-600 mb-6">Your withdrawal has been processed</p>

            <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3 mb-6 text-left">
              <div>
                <p className="text-xs text-gray-600 mb-1">Full Name</p>
                <p className="font-bold text-gray-900">{fullName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Bank</p>
                <p className="font-bold text-gray-900">{bankName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Account Number</p>
                <p className="font-mono font-bold text-gray-900 text-sm">{accountNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Amount</p>
                <p className="font-bold text-[#0000ff]">NGN {parseFloat(amount).toLocaleString()}.00</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Transaction Type</p>
                <p className="font-bold text-gray-900">Withdrawal</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Transaction ID</p>
                <p className="font-mono font-bold text-gray-900 text-xs">{transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Session ID</p>
                <p className="font-mono font-bold text-gray-900 text-xs">{sessionId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Date & Time</p>
                <p className="font-bold text-gray-900 text-xs">{getCurrentDateTime()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <p className="font-bold text-green-600">Successful</p>
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

  // Countdown Screens
  if (step === 'countdown1' || step === 'countdown2') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-6xl font-bold text-[#0000ff] mb-4 tabular-nums">{countdown}</div>
          <p className="text-gray-600 text-lg">
            {step === 'countdown1' ? 'Processing your withdrawal request...' : 'Finalizing your transaction...'}
          </p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we process your request</p>
        </div>
      </div>
    )
  }

  // Confirm Page
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
            <h3 className="font-bold text-gray-900 text-lg">Withdrawal Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between pb-3 border-b border-gray-200">
                <span className="text-gray-600">Bank</span>
                <span className="font-bold text-gray-900">{bankName}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-200">
                <span className="text-gray-600">Account Number</span>
                <span className="font-mono font-bold text-gray-900">{accountNumber}</span>
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
              disabled={loading}
              className="w-full bg-[#0000ff] text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'PROCEED'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Form Page
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 max-w-2xl mx-auto px-4 py-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Withdraw Funds</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="bg-gradient-to-r from-[#0000ff] to-blue-600 rounded-xl p-4 text-white mb-4">
          <p className="text-white/70 text-xs mb-1">Available Balance</p>
          <h2 className="text-2xl font-bold">NGN {balance.toLocaleString()}</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Select Bank</label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
            >
              <option value="">Choose bank</option>
              {banks.map((bank) => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter account number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Account Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Enter account holder name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter withdrawal amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
              min="1000"
            />
            <p className="text-xs text-gray-600 mt-1">Minimum: ₦1,000</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">BPC CODE</label>
            <div className="relative">
              <input
                type={showBpcCode ? 'text' : 'password'}
                value={bpcCode}
                onChange={(e) => setBpcCode(e.target.value)}
                placeholder="Enter BPC CODE"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowBpcCode(!showBpcCode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showBpcCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-[#0000ff] text-white font-bold py-3 rounded-xl hover:opacity-90 transition mt-6"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
