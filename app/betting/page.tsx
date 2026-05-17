'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
  Copy,
  Dices,
} from 'lucide-react'

export default function BettingPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [username, setUsername] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const platforms = [
    { name: 'Bet365', code: 'BET365' },
    { name: 'SportyBet', code: 'SPORTYBET' },
    { name: 'Betking', code: 'BETKING' },
    { name: '1xBet', code: '1XBET' },
    { name: 'Nairabet', code: 'NAIRABET' },
    { name: 'NaijaBet', code: 'NAIJABET' },
  ]

  const bettingPlans = [
    { amount: 500, bonus: 50 },
    { amount: 1000, bonus: 150 },
    { amount: 2000, bonus: 400 },
    { amount: 5000, bonus: 1250 },
    { amount: 10000, bonus: 3000 },
    { amount: 20000, bonus: 6000 },
  ]

  const validateForm = () => {
    if (!selectedPlatform) {
      setError('Please select a betting platform')
      return false
    }
    if (!username || username.length < 3) {
      setError('Please enter a valid username')
      return false
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please select an amount')
      return false
    }
    if (parseFloat(amount) > 250000) {
      setError('Insufficient balance')
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
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setStep('success')
    } catch (err) {
      setError('Failed to process betting deposit. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 'form') {
      router.back()
    } else if (step === 'confirm') {
      setStep('form')
      setError('')
    } else {
      router.push('/dashboard')
    }
  }

  const selectedPlatformObj = platforms.find((p) => p.name === selectedPlatform)
  const selectedPlan = bettingPlans.find((p) => p.amount.toString() === amount)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Betting Deposit</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'form' || step === 'confirm' || step === 'success'
                ? 'bg-indigo-600'
                : 'bg-gray-200'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'confirm' || step === 'success'
                ? 'bg-indigo-600'
                : 'bg-gray-200'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'success' ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          />
        </div>

        {/* Form Step */}
        {step === 'form' && (
          <div className="space-y-6">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Betting Platform
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              >
                <option value="">Choose a platform</option>
                {platforms.map((platform) => (
                  <option key={platform.code} value={platform.name}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Betting Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your betting username"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
              <p className="text-xs text-gray-600 mt-2">
                The username associated with your betting account
              </p>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Deposit Amount
              </label>
              <div className="grid grid-cols-2 gap-3">
                {bettingPlans.map((plan) => (
                  <button
                    key={plan.amount}
                    onClick={() => setAmount(plan.amount.toString())}
                    className={`py-3 px-4 rounded-xl font-semibold transition border-2 ${
                      amount === plan.amount.toString()
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                        : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-bold">₦{plan.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">+₦{plan.bonus}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Benefits Info */}
            {amount && selectedPlan && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-3 font-semibold">
                  Your Bonus
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Deposit Amount:</span>
                    <span className="font-semibold text-gray-900">
                      ₦{parseInt(amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Bonus Credit:</span>
                    <span className="font-semibold text-indigo-600">
                      +₦{selectedPlan.bonus}
                    </span>
                  </div>
                  <div className="h-px bg-indigo-200 my-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-semibold">Total to Bet:</span>
                    <span className="font-bold text-indigo-600">
                      ₦{(parseInt(amount) + selectedPlan.bonus).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Bonus credits must be used for betting. Confirm your username is correct before proceeding.
              </p>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition mt-6"
            >
              Review & Confirm
            </button>
          </div>
        )}

        {/* Confirmation Step */}
        {step === 'confirm' && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">
                Confirm Deposit
              </h2>
              
              <div className="space-y-4 py-4 border-t border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform</span>
                  <span className="font-bold text-gray-900">
                    {selectedPlatform}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Username</span>
                  <span className="font-semibold text-gray-900">
                    {username}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deposit Amount</span>
                  <span className="font-bold text-gray-900">
                    ₦{parseInt(amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bonus Credit</span>
                  <span className="font-semibold text-indigo-600">
                    +₦{selectedPlan?.bonus}
                  </span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-900">Total to Bet</span>
                  <span className="font-bold text-indigo-600">
                    ₦{(parseInt(amount) + (selectedPlan?.bonus || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Your account details will be verified before the deposit is sent to your betting platform.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Deposit'
                )}
              </button>
              <button
                onClick={() => setStep('form')}
                disabled={isLoading}
                className="w-full bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
              >
                Edit Details
              </button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="space-y-6 text-center py-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Deposit Successful!
              </h2>
              <p className="text-gray-600">
                Your betting account is being credited.
              </p>
            </div>

            {/* Details */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 text-left mt-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Platform</span>
                <span className="font-semibold text-gray-900">
                  {selectedPlatform}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Username</span>
                <span className="font-semibold text-gray-900">
                  {username}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Deposited</span>
                <span className="font-bold text-indigo-600">
                  ₦{parseInt(amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bonus Credited</span>
                <span className="font-bold text-indigo-600">
                  +₦{selectedPlan?.bonus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-semibold text-green-600">Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-gray-900">
                    TX{Date.now().toString().slice(-8)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(`TX${Date.now().toString().slice(-8)}`)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Confirmation Message */}
            {copied && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
                Transaction ID copied to clipboard
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Next Steps:</span> Your funds and bonus credit have been sent to your {selectedPlatform} account. You can now place bets immediately!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setStep('form')
                  setUsername('')
                  setAmount('')
                  setError('')
                }}
                className="w-full bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
              >
                Make Another Deposit
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
