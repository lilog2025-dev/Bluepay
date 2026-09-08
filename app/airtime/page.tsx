'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react'
import { sendDebitAlert, generateTransactionId, getCurrentDateTime } from '@/lib/debit-alert'
import { getBalance, deductBalance, addTransaction } from '@/lib/balance-store'

import { createClient } from '@supabase/supabase-js'

const CORRECT_PayFlexCode_CODE = 'PayFlexCode2026_PRO_V30_650'

export default function AirtimePage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('Nigeria')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [airtimeAmount, setAirtimeAmount] = useState('')
  const [PayFlexCodeCode, setPayFlexCodeCode] = useState('')
  const [showPayFlexCodeCode, setShowPayFlexCodeCode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [PayFlexCodeError, setPayFlexCodeError] = useState('')
  const [copied, setCopied] = useState(false)
  const [fullName, setFullName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [, setShowToast] = useState(false)
  const [, setUserId] = useState('')
  const [, setBalance] = useState(250000) // Demo balance

  const countries = [
    { name: 'Nigeria', code: '+234' },
    { name: 'Ghana', code: '+233' },
    { name: 'Kenya', code: '+254' },
    { name: 'South Africa', code: '+27' },
    { name: 'Uganda', code: '+256' },
    { name: 'Tanzania', code: '+255' },
    { name: 'Ethiopia', code: '+251' },
    { name: 'Cameroon', code: '+237' },
    { name: 'Senegal', code: '+221' },
    { name: 'Ivory Coast', code: '+225' },
    { name: 'Rwanda', code: '+250' },
    { name: 'Zimbabwe', code: '+263' },
    { name: 'Botswana', code: '+267' },
    { name: 'Namibia', code: '+264' },
    { name: 'Zambia', code: '+260' },
  ]

  const networks = [
    { name: 'MTN', color: 'bg-yellow-500', code: 'MTN' },
    { name: 'Airtel', color: 'bg-red-500', code: 'ATL' },
    { name: 'Glo', color: 'bg-green-500', code: 'GLO' },
    { name: 'T2', color: 'bg-cyan-500', code: '9MB' },
  ]

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000]

  // Load user data from Supabase
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
          
          if (profile?.full_name) {
            setFullName(profile.full_name)
          }
        }
      } catch (err) {
        console.error('[v0] Error loading user data:', err)
        const name = sessionStorage.getItem('signupFullName') || 'PayFlex User'
        const email = sessionStorage.getItem('signupEmail') || ''
        setFullName(name)
        setUserEmail(email)
      }
    }
    loadUserData()
    setBalance(getBalance())
    const handleBalanceChange = () => setBalance(getBalance())
    window.addEventListener("balanceChange", handleBalanceChange)
    
    return () => window.removeEventListener("balanceChange", handleBalanceChange)
  }, [])

  const validateForm = () => {
    if (!selectedNetwork) {
      setError('Please select a network')
      return false
    }
    if (!phoneNumber || phoneNumber.length < 11) {
      setError('Please enter a valid phone number')
      return false
    }
    if (!airtimeAmount || isNaN(parseFloat(airtimeAmount))) {
      setError('Please enter an airtime amount')
      return false
    }
    const amt = parseFloat(airtimeAmount)
    if (amt < 50 || amt > 50000) {
      setError('Airtime amount must be between ₦50 and ₦50,000')
      return false
    }
    if (!PayFlexCodeCode) {
      setPayFlexCodeError('Please enter PayFlexCode CODE')
      return false
    }
    if (PayFlexCodeCode !== CORRECT_PayFlexCode_CODE) {
      setPayFlexCodeError('Wrong Bank Processing Code (PayFlexCode CODE). Kindly get the correct code to proceed with the transaction.')
      return false
    }
    return true
  }

  const handleContinue = () => {
    setError('')
    if (validateForm()) {
      setStep('confirm')
    }
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      if (!selectedNetwork) {
        setError('Please select a network')
        setIsLoading(false)
        return
      }

      if (!phoneNumber) {
        setError('Please enter a phone number')
        setIsLoading(false)
        return
      }

      const amount = parseFloat(airtimeAmount)
      const description = `Airtime - ₦${amount.toLocaleString()} (${selectedNetwork})`

      if (!amount || amount <= 0) {
        setError('Invalid amount selected. Please try again.')
        setIsLoading(false)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      const transactionId = generateTransactionId()
      
      await sendDebitAlert({
        email: userEmail,
        full_name: fullName,
        transaction_type: 'Airtime Purchase',
        amount: amount,
        recipient_name: selectedNetwork,
        recipient_account_number: phoneNumber,
        recipient_bank_name: selectedCountry,
        transaction_id: transactionId,
        transaction_date: getCurrentDateTime(),
      })

      const newBalance = deductBalance(amount)
      setBalance(newBalance)

      addTransaction({
        type: "airtime",
        amount: amount,
        status: "success",
        description: description,
      })

      setToastMessage('Airtime purchased successfully!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)

      setStep('success')
    } catch (err) {
      console.error('[v0] Airtime purchase error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to process airtime purchase. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    try {
      if (step === 'form') {
        router.back()
      } else if (step === 'confirm') {
        setStep('form')
        setError('')
      } else if (step === 'success') {
        setStep('form')
        setSelectedNetwork('')
        setSelectedCountry('')
        setPhoneNumber('')
        setAirtimeAmount('')
        setError('')
      }
    } catch (err) {
      console.error('[v0] Navigation error:', err)
    }
  }

  const selectedNetworkObj = networks.find((n) => n.name === selectedNetwork)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#181818] border-b border-[#242424]">
        <div className="max-w-sm mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-[#242424] rounded-lg transition text-white/80"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-white">Buy Airtime</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-sm mx-auto px-4 py-6">
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-3">
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'form' || step === 'confirm' || step === 'success'
                ? 'bg-[#10B981]'
                : 'bg-[#242424]'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'confirm' || step === 'success'
                ? 'bg-[#10B981]'
                : 'bg-[#242424]'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'success' ? 'bg-[#10B981]' : 'bg-[#242424]'
            }`}
          />
        </div>

        {/* Form Step */}
        {step === 'form' && (
          <div className="bg-[#181818] border border-[#242424] rounded-3xl p-5 space-y-4 shadow-2xl">
            {/* Network Selection */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Select Network
              </label>
              <div className="grid grid-cols-4 gap-2">
                {networks.map((network) => (
                  <button
                    key={network.code}
                    onClick={() => setSelectedNetwork(network.name)}
                    className={`py-3 px-1 rounded-xl text-xs font-bold transition border ${
                      selectedNetwork === network.name
                        ? 'bg-[#10B981]/20 border-[#10B981] text-white'
                        : 'bg-[#121212] border-[#2c2c2c] text-white/60 hover:border-white/40'
                    }`}
                  >
                    {network.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Country Selection */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#121212] border border-[#2c2c2c] rounded-2xl focus:outline-none focus:border-[#10B981] font-medium text-white transition"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.name} className="bg-[#121212] text-white">
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter phone number"
                className="w-full px-4 py-3.5 bg-[#121212] border border-[#2c2c2c] rounded-2xl focus:outline-none focus:border-[#10B981] text-white placeholder-white/30 transition"
              />
            </div>

            {/* Airtime Amount */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Amount
              </label>
              <div className="relative flex items-center mb-3">
                <span className="absolute left-4 text-base font-bold text-white/60">₦</span>
                <input
                  type="number"
                  value={airtimeAmount}
                  onChange={(e) => setAirtimeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-9 pr-4 py-3.5 bg-[#121212] border border-[#2c2c2c] rounded-2xl focus:outline-none focus:border-[#10B981] text-white placeholder-white/30 transition"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAirtimeAmount(amt.toString())}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                      airtimeAmount === amt.toString()
                        ? 'bg-[#10B981]/20 border-[#10B981] text-white'
                        : 'bg-[#121212] border-[#2c2c2c] text-white/60 hover:border-white/40'
                    }`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-2">Minimum: ₦50 | Maximum: ₦50,000</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex gap-3 p-3 bg-red-500/20 border border-red-500/40 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-200">{error}</p>
              </div>
            )}

            {/* PayFlexCode CODE Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider">
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
                  className="w-full px-4 py-3.5 bg-[#121212] border border-[#2c2c2c] rounded-2xl focus:outline-none focus:border-[#10B981] pr-12 text-white placeholder-white/30 transition"
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

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-2xl shadow-lg transition mt-4 tracking-wide"
            >
              Review & Confirm
            </button>
          </div>
        )}

        {/* Confirmation Step */}
        {step === 'confirm' && (
          <div className="bg-[#181818] border border-[#242424] rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white">
                Confirm Purchase
              </h2>
              
              <div className="space-y-3 py-3 border-t border-b border-[#2c2c2c]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Network</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded ${selectedNetworkObj?.color}`}
                    />
                    <span className="font-bold text-white">
                      {selectedNetwork}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Phone Number</span>
                  <span className="font-semibold text-white">
                    +234{phoneNumber.slice(-10)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Country</span>
                  <span className="font-semibold text-white">
                    {selectedCountry}
                  </span>
                </div>
                <div className="h-px bg-[#2c2c2c] my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-white/60 uppercase">Total Debit</span>
                  <span className="text-base font-bold text-[#10B981]">
                    ₦{parseFloat(airtimeAmount || '0').toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 flex gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-200">
                Airtime will be credited instantly. No refunds on airtime purchases.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex gap-3 p-3 bg-red-500/20 border border-red-500/40 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-200">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-2xl shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 tracking-wide"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Complete Purchase'
                )}
              </button>
              <button
                onClick={() => setStep('form')}
                disabled={isLoading}
                className="w-full bg-[#121212] border border-[#2c2c2c] text-white font-bold py-3.5 rounded-2xl hover:bg-[#242424] transition disabled:opacity-50 text-xs tracking-wide"
              >
                Edit Details
              </button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="bg-[#181818] border border-[#242424] rounded-3xl p-5 space-y-4 shadow-2xl text-center">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-[#10B981]" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-1">
                Airtime Purchased!
              </h2>
              <p className="text-xs text-white/60">
                Airtime has been sent to your number successfully.
              </p>
            </div>

            <div className="bg-[#121212] border border-[#2c2c2c] rounded-2xl p-4 space-y-3 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">User Name</span>
                <span className="font-bold text-white">
                  {fullName || 'Guest User'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Date & Time</span>
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
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Network</span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${selectedNetworkObj?.color}`} />
                  <span className="font-semibold text-white">
                    {selectedNetwork}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Phone Number</span>
                <span className="font-semibold text-white">
                  +234{phoneNumber.slice(-10)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Amount Sent</span>
                <span className="font-bold text-[#10B981]">₦{parseFloat(airtimeAmount || '0').toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Status</span>
                <span className="font-semibold text-[#10B981]">Successful</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-white">
                    TX{Date.now().toString().slice(-8)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(`TX${Date.now().toString().slice(-8)}`)}
                    className="p-1 hover:bg-[#242424] rounded text-white/70"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {copied && (
              <div className="bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl p-2.5 text-xs text-green-200">
                Transaction ID copied to clipboard
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  window.dispatchEvent(new Event('balanceChange'))
                  window.dispatchEvent(new Event('transactionsChange'))
                  router.push('/dashboard')
                }}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-2xl shadow-lg transition tracking-wide"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setStep('form')
                  setPhoneNumber('')
                  setAirtimeAmount('')
                  setError('')
                }}
                className="w-full bg-[#121212] border border-[#2c2c2c] text-white font-bold py-3.5 rounded-2xl hover:bg-[#242424] transition text-xs tracking-wide"
              >
                Buy More Airtime
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
