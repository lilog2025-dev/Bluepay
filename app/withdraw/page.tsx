'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function WithdrawPage() {
  const router = useRouter()
  const [balance, setBalance] = useState<number>(0)
  const [amount, setAmount] = useState<string>('')
  const [bank, setBank] = useState<string>('')
  const [accountNumber, setAccountNumber] = useState<string>('')
  const [accountName, setAccountName] = useState<string>('')
  const [payflexCode, setPayflexCode] = useState<string>('')
  const [showCode, setShowCode] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedBalance = localStorage.getItem('user_available_balance')
    if (storedBalance) {
      setBalance(parseFloat(storedBalance))
    }
  }, [])

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString())
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const withdrawVal = parseFloat(amount)
    if (!withdrawVal || withdrawVal <= 0) {
      setError('Please enter a valid withdrawal amount.')
      return
    }
    if (withdrawVal > balance) {
      setError('Insufficient available balance.')
      return
    }
    if (!bank || accountNumber.length !== 10 || !accountName) {
      setError('Please fill in valid bank account details.')
      return
    }
    if (!payflexCode) {
      setError('Please enter your PayFlex Code.')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const newBalance = balance - withdrawVal
      setBalance(newBalance)
      localStorage.setItem('user_available_balance', newBalance.toString())
      setIsLoading(false)
      setSuccess(true)

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-12">
      {/* Header */}
      <header className="bg-[#181a20] border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 text-white/80 hover:bg-white/10 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-white">Withdraw Funds</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-5">
        {/* Step Indicator Bar */}
        <div className="flex gap-2 mb-2">
          <div className="h-1 bg-blue-500 flex-1 rounded-full"></div>
          <div className="h-1 bg-white/10 flex-1 rounded-full"></div>
          <div className="h-1 bg-white/10 flex-1 rounded-full"></div>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4">
          {/* Withdrawal Amount */}
          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              Withdrawal Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 font-bold">₦</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-3.5 pl-9 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <p className="text-xs text-white/50 mt-1.5">
              Available balance: NGN{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Quick Amounts */}
          <div>
            <p className="text-xs text-white/50 mb-2">Quick amounts</p>
            <div className="grid grid-cols-4 gap-2">
              {[5000, 10000, 25000, 50000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="bg-[#1a1c23] border border-white/10 hover:border-blue-500 py-2 rounded-xl text-xs font-bold text-white transition"
                >
                  ₦{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Select Bank */}
          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              Select Bank
            </label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:border-blue-500 transition"
            >
              <option value="" disabled className="bg-[#1a1c23]">Choose Bank</option>
              <option value="opay" className="bg-[#1a1c23]">OPay</option>
              <option value="kuda" className="bg-[#1a1c23]">Kuda Bank</option>
              <option value="gtb" className="bg-[#1a1c23]">Guaranty Trust Bank</option>
              <option value="zenith" className="bg-[#1a1c23]">Zenith Bank</option>
              <option value="access" className="bg-[#1a1c23]">Access Bank</option>
            </select>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              Account Number
            </label>
            <input
              type="text"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="10 digit account number"
              className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Account Holder Name */}
          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              Account Holder Name
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Full name as shown on bank account"
              className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* INPUT PayFlex CODE */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider">
                INPUT PayFlex CODE
              </label>
              <button
                type="button"
                onClick={() => router.push('/buy-payflex-code')}
                className="text-xs text-blue-400 font-bold hover:underline"
              >
                Buy PayFlex Code
              </button>
            </div>
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                value={payflexCode}
                onChange={(e) => setPayflexCode(e.target.value)}
                placeholder="Enter PayFlex Code"
                className="w-full bg-[#1a1c23] border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
              >
                {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error / Success Alerts */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-xs text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <p className="text-xs text-green-200">Withdrawal successful! Redirecting...</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg transition duration-200 disabled:opacity-50 mt-6"
          >
            {isLoading ? 'Processing Transfer...' : 'Proceed to Withdraw'}
          </button>
        </form>
      </main>
    </div>
  )
}
