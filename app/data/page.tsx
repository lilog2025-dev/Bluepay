'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
  Copy,
  Zap,
} from 'lucide-react'

export default function DataPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const networks = [
    { name: 'MTN', color: 'bg-yellow-500', code: 'MTN' },
    { name: 'Airtel', color: 'bg-red-500', code: 'ATL' },
    { name: 'Glo', color: 'bg-green-500', code: 'GLO' },
    { name: '9Mobile', color: 'bg-cyan-500', code: '9MB' },
  ]

  const dataPlans = [
    { size: '100MB', validity: '1 day', price: 50 },
    { size: '500MB', validity: '7 days', price: 200 },
    { size: '1GB', validity: '30 days', price: 500 },
    { size: '2GB', validity: '30 days', price: 900 },
    { size: '5GB', validity: '30 days', price: 2000 },
    { size: '10GB', validity: '30 days', price: 3500 },
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
    if (!selectedPlan) {
      setError('Please select a data plan')
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
      setError('Failed to process data purchase. Please try again.')
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
  const selectedPlanObj = dataPlans.find((p) => p.size === selectedPlan)

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
          <h1 className="text-lg font-bold text-gray-900">Buy Data</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'form' || step === 'confirm' || step === 'success'
                ? 'bg-cyan-500'
                : 'bg-gray-200'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'confirm' || step === 'success'
                ? 'bg-cyan-500'
                : 'bg-gray-200'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'success' ? 'bg-cyan-500' : 'bg-gray-200'
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
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                  +234
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="801 234 5678"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Data Plans */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Data Plan
              </label>
              <div className="space-y-2">
                {dataPlans.map((plan) => (
                  <button
                    key={plan.size}
                    onClick={() => setSelectedPlan(plan.size)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition border-2 flex items-center justify-between ${
                      selectedPlan === plan.size
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-700'
                        : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-bold">{plan.size}</p>
                      <p className="text-xs text-gray-600">{plan.validity}</p>
                    </div>
                    <p className="text-lg font-bold">₦{plan.price.toLocaleString()}</p>
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
            {selectedPlan && selectedPlanObj && (
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-3 font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-600" />
                  Plan Details
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Data Size:</span>
                    <span className="font-bold text-gray-900">{selectedPlanObj.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Validity:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedPlanObj.validity}
                    </span>
                  </div>
                  <div className="h-px bg-cyan-200 my-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-semibold">Amount to Pay:</span>
                    <span className="font-bold text-cyan-600">
                      ₦{selectedPlanObj.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition mt-6"
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
                  <span className="text-gray-600">Data Plan</span>
                  <span className="font-bold text-gray-900">
                    {selectedPlanObj?.size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Validity</span>
                  <span className="font-semibold text-gray-900">
                    {selectedPlanObj?.validity}
                  </span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-900">Total Debit</span>
                  <span className="font-bold text-cyan-500">
                    ₦{selectedPlanObj?.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Data will be activated on your phone within seconds of confirmation. No refunds on data purchases.
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
                className="w-full bg-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
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
                Data Purchased!
              </h2>
              <p className="text-gray-600">
                Data is being activated on your number.
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
                <span className="text-gray-600">Data Received</span>
                <span className="font-bold text-cyan-600">{selectedPlanObj?.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Validity</span>
                <span className="font-semibold text-gray-900">
                  {selectedPlanObj?.validity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-semibold text-green-600">Active</span>
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
                className="w-full bg-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setStep('form')
                  setPhoneNumber('')
                  setSelectedPlan('')
                  setError('')
                }}
                className="w-full bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
              >
                Buy More Data
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
