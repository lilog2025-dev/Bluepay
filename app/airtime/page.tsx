'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
  Phone,
  Copy,
} from 'lucide-react'

export default function AirtimePage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const networks = [
    { name: 'MTN', color: 'bg-yellow-500', code: 'MTN' },
    { name: 'Airtel', color: 'bg-red-500', code: 'ATL' },
    { name: 'Glo', color: 'bg-green-500', code: 'GLO' },
    { name: '9Mobile', color: 'bg-cyan-500', code: '9MB' },
  ]

  const airtimePlans = [
    { amount: 100, bonus: 10 },
    { amount: 200, bonus: 25 },
    { amount: 500, bonus: 75 },
    { amount: 1000, bonus: 150 },
    { amount: 2000, bonus: 350 },
    { amount: 5000, bonus: 1000 },
  ]

  const validateForm = () => {
    if (!selectedNetwork) {
      setError('Please select a network')
      return false
    }
    if (!phoneNumber || phoneNumber.length < 11) {
      setError('Please enter a valid phone number')
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
      setError('Failed to process airtime purchase. Please try again.')
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

  const selectedNetworkObj = networks.find((n) => n.name === selectedNetwork)
  const selectedPlan = airtimePlans.find((p) => p.amount.toString() === amount)

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
          <h1 className="text-lg font-bold text-gray-900">Buy Airtime</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'form' || step === 'confirm' || step === 'success'
                ? 'bg-yellow-500'
                : 'bg-gray-200'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'confirm' || step === 'success'
                ? 'bg-yellow-500'
                : 'bg-gray-200'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'success' ? 'bg-yellow-500' : 'bg-gray-200'
            }`}
          />
        </div>

        {/* Form Step */}
        {step === 'form' && (
          <div className="space-y-6">
            {/* Network Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Network
              </label>
              <div className="grid grid-cols-4 gap-3">
                {networks.map((network) => (
                  <button
                    key={network.code}
                    onClick={() => setSelectedNetwork(network.name)}
                    className={`py-4 px-2 rounded-xl font-semibold transition ${
                      selectedNetwork === network.name
                        ? `${network.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {network.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                    +234
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="801 234 5678"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Amount
              </label>
              <div className="grid grid-cols-2 gap-3">
                {airtimePlans.map((plan) => (
                  <button
                    key={plan.amount}
                    onClick={() => setAmount(plan.amount.toString())}
                    className={`py-3 px-4 rounded-xl font-semibold transition border-2 ${
                      amount === plan.amount.toString()
                        ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                        : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm">₦{plan.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">+₦{plan.bonus} bonus</p>
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
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-3 font-semibold">
                  Package Details
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Base Amount:</span>
                    <span className="font-semibold text-gray-900">
                      ₦{parseInt(amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Bonus Credit:</span>
                    <span className="font-semibold text-green-600">
                      +₦{selectedPlan.bonus}
                    </span>
                  </div>
                  <div className="h-px bg-amber-200 my-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-semibold">Total Value:</span>
                    <span className="font-bold text-yellow-600">
                      ₦{(selectedPlan.amount + selectedPlan.bonus).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition mt-6"
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
                Confirm Purchase
              </h2>
              
              <div className="space-y-4 py-4 border-t border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Network</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded ${selectedNetworkObj?.color}`}
                    />
                    <span className="font-bold text-gray-900">
                      {selectedNetwork}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone Number</span>
                  <span className="font-semibold text-gray-900">
                    +234{phoneNumber.slice(-10)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-gray-900">
                    ₦{parseInt(amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bonus</span>
                  <span className="font-semibold text-green-600">
                    +₦{selectedPlan?.bonus}
                  </span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-900">Total Debit</span>
                  <span className="font-bold text-yellow-500">
                    ₦{parseInt(amount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Airtime credit will be delivered to the phone number within seconds of confirmation.
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
                className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
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
                Airtime Purchased!
              </h2>
              <p className="text-gray-600">
                Airtime credit is being delivered to your number.
              </p>
            </div>

            {/* Details */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 text-left mt-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Network</span>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${selectedNetworkObj?.color}`} />
                  <span className="font-semibold text-gray-900">
                    {selectedNetwork}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone Number</span>
                <span className="font-semibold text-gray-900">
                  +234{phoneNumber.slice(-10)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Credited</span>
                <span className="font-bold text-yellow-600">
                  ₦{(parseInt(amount) + (selectedPlan?.bonus || 0)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-semibold text-green-600">Successful</span>
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

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setStep('form')
                  setPhoneNumber('')
                  setAmount('')
                  setError('')
                }}
                className="w-full bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
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
