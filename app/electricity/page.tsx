'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
  Copy,
  Lightbulb,
} from 'lucide-react'

export default function ElectricityPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form')
  const [selectedDisco, setSelectedDisco] = useState('')
  const [meterType, setMeterType] = useState('')
  const [meterNumber, setMeterNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const discos = [
    { name: 'EKEDC', code: 'EKEDC' },
    { name: 'IKEDC', code: 'IKEDC' },
    { name: 'LEKKI EKO ELECTRICITY', code: 'LEKKI' },
    { name: 'AEDC', code: 'AEDC' },
    { name: 'BENIN ELECTRICITY', code: 'BENIN' },
    { name: 'KANO ELECTRIC', code: 'KANO' },
    { name: 'KADUNA ELECTRIC', code: 'KADUNA' },
    { name: 'ABUJA ELECTRICITY', code: 'ABUJA' },
  ]

  const electricityPlans = [
    { amount: 1000, unit: 'Unit' },
    { amount: 2000, unit: 'Unit' },
    { amount: 5000, unit: 'Unit' },
    { amount: 10000, unit: 'Unit' },
    { amount: 20000, unit: 'Unit' },
    { amount: 50000, unit: 'Unit' },
  ]

  const validateForm = () => {
    if (!selectedDisco) {
      setError('Please select electricity provider')
      return false
    }
    if (!meterType) {
      setError('Please select meter type')
      return false
    }
    if (!meterNumber || meterNumber.length < 11) {
      setError('Please enter a valid meter number')
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
      setError('Failed to process electricity payment. Please try again.')
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

  const selectedDiscoObj = discos.find((d) => d.name === selectedDisco)

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
          <h1 className="text-lg font-bold text-gray-900">Buy Electricity</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'form' || step === 'confirm' || step === 'success'
                ? 'bg-yellow-600'
                : 'bg-gray-200'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'confirm' || step === 'success'
                ? 'bg-yellow-600'
                : 'bg-gray-200'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'success' ? 'bg-yellow-600' : 'bg-gray-200'
            }`}
          />
        </div>

        {/* Form Step */}
        {step === 'form' && (
          <div className="space-y-6">
            {/* Electricity Provider */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Electricity Provider
              </label>
              <select
                value={selectedDisco}
                onChange={(e) => setSelectedDisco(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              >
                <option value="">Select your provider</option>
                {discos.map((disco) => (
                  <option key={disco.code} value={disco.name}>
                    {disco.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Meter Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Meter Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Prepaid', 'Postpaid'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setMeterType(type)}
                    className={`py-3 px-4 rounded-xl font-semibold transition border-2 ${
                      meterType === type
                        ? 'bg-yellow-50 border-yellow-600 text-yellow-700'
                        : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Meter Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Meter Number
              </label>
              <input
                type="text"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                placeholder="Enter your 11-digit meter number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              />
              <p className="text-xs text-gray-600 mt-2">
                Usually found on your electricity bill
              </p>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Amount to Pay
              </label>
              <div className="grid grid-cols-2 gap-3">
                {electricityPlans.map((plan) => (
                  <button
                    key={plan.amount}
                    onClick={() => setAmount(plan.amount.toString())}
                    className={`py-3 px-4 rounded-xl font-semibold transition border-2 ${
                      amount === plan.amount.toString()
                        ? 'bg-yellow-50 border-yellow-600 text-yellow-700'
                        : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-bold">₦{plan.amount.toLocaleString()}</p>
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

            {/* Info Message */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Payment will be processed immediately and token sent to your registered email.
              </p>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition mt-6"
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
                Confirm Payment
              </h2>
              
              <div className="space-y-4 py-4 border-t border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider</span>
                  <span className="font-bold text-gray-900">
                    {selectedDisco}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Meter Type</span>
                  <span className="font-semibold text-gray-900">
                    {meterType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Meter Number</span>
                  <span className="font-semibold text-gray-900">
                    {meterNumber.slice(-4).padStart(meterNumber.length, '*')}
                  </span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-900">Amount</span>
                  <span className="font-bold text-yellow-600">
                    ₦{parseInt(amount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Ensure meter number is correct before confirming. Incorrect meter details cannot be reversed.
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
                className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Complete Payment'
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
                Payment Successful!
              </h2>
              <p className="text-gray-600">
                Your electricity token is being sent to your email.
              </p>
            </div>

            {/* Details */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 text-left mt-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Provider</span>
                <span className="font-semibold text-gray-900">
                  {selectedDisco}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Meter Type</span>
                <span className="font-semibold text-gray-900">
                  {meterType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-bold text-yellow-600">
                  ₦{parseInt(amount).toLocaleString()}
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

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Next Steps:</span> Check your email for the electricity token. Enter the token code on your meter device within 30 minutes.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setStep('form')
                  setMeterNumber('')
                  setAmount('')
                  setError('')
                }}
                className="w-full bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
              >
                Pay Another Meter
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
