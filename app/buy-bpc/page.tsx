'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, AlertCircle, Upload, Loader } from 'lucide-react'

export default function BuyBPCPage() {
  const router = useRouter()
  const [step, setStep] = useState<'amount' | 'payment' | 'receipt' | 'success'>('amount')
  const [amount, setAmount] = useState(10650)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [fullName, setFullName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const BPC_PRICE = 10650
  const ACCOUNT_NUMBER = '6711230988'
  const ACCOUNT_NAME = 'CHI MODE AGB'
  const EDGE_FUNCTION_URL = 'https://rykdsszbtjvnoycmialc.supabase.co/functions/v1/send-bpc-email'

  // Get user data from session
  useEffect(() => {
    const name = sessionStorage.getItem('signupFullName') || 'User'
    const email = sessionStorage.getItem('signupEmail') || ''
    setFullName(name)
    setUserEmail(email)
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setReceiptFile(file)
      setError('')
    } else {
      setError('Please upload a valid image file')
    }
  }

  const handleVerifyPayment = async () => {
    if (!receiptFile) {
      setError('Please upload receipt image')
      return
    }

    if (!transactionId.trim()) {
      setError('Please enter a transaction ID')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      // Call the Supabase Edge Function to send BPC email
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          full_name: fullName,
          email: userEmail,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Payment verification failed. Please try again.')
        setIsVerifying(false)
        return
      }

      // Success - show success state
      setSuccess('Payment verified successfully. BPC email sent.')
      setTimeout(() => {
        setStep('success')
      }, 1500)
    } catch (err) {
      console.error('[v0] Payment verification error:', err)
      setError('An error occurred during verification. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleProceed = () => {
    if (step === 'amount') {
      setStep('payment')
    } else if (step === 'payment') {
      setStep('receipt')
    } else if (step === 'receipt') {
      if (!receiptFile) {
        setError('Please upload receipt image')
        return
      }
      if (!transactionId.trim()) {
        setError('Please enter transaction ID')
        return
      }
      handleVerifyPayment()
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#0000ff] hover:opacity-80 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Buy BPC</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {step === 'amount' && (
          <>
            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">BPC Code Information</h3>
              <p className="text-gray-600 text-sm">
                BLUEPAY PRO V30 codes are digital credits that can be used to access premium features and services on our platform.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Standard Price
                </label>
                <input
                  type="text"
                  value={`NGN ${amount.toLocaleString()}`}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl font-bold text-gray-900"
                />
              </div>

              <button
                onClick={handleProceed}
                className="w-full bg-[#0000ff] text-white font-bold py-4 rounded-2xl hover:opacity-90 transition"
              >
                Proceed to Payment
              </button>
            </div>
          </>
        )}

        {step === 'payment' && (
          <>
            <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200 mb-6">
              <div className="flex gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Important Notice</h3>
                  <p className="text-gray-600 text-xs">
                    BLUEPAY PRO V30 does not accept payments from OPay bank. Any payment made from OPay will be declined and not reversed. Kindly use other Nigerian banks.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Bank Account Details
                </label>
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Bank Name</p>
                      <p className="font-bold text-gray-900">BLUEPAY PRO V30</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Account Number</p>
                      <p className="font-mono font-bold text-[#0000ff] text-lg">{ACCOUNT_NUMBER}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Account Name</p>
                      <p className="font-bold text-gray-900">{ACCOUNT_NAME}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Amount to Transfer</p>
                      <p className="font-bold text-gray-900 text-lg">NGN {amount.toLocaleString()}.00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleProceed}
                  className="w-full bg-[#0000ff] text-white font-bold py-4 rounded-2xl hover:opacity-90 transition"
                >
                  I Have Made the Payment
                </button>
                <button
                  onClick={() => setStep('amount')}
                  className="w-full bg-gray-200 text-gray-900 font-bold py-4 rounded-2xl hover:bg-gray-300 transition"
                >
                  Back
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'receipt' && (
          <>
            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">Upload Payment Receipt & Transaction ID</h3>
              <p className="text-gray-600 text-sm">
                Please upload a screenshot of your payment receipt and enter the transaction ID to verify your payment.
              </p>
            </div>

            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              {/* Transaction ID Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter your transaction ID"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-[#0000ff]"
                />
              </div>

              {/* Receipt Upload */}
              <div>
                <label className="block w-full">
                  <div className="border-2 border-dashed border-[#0000ff] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition">
                    <Upload className="w-12 h-12 text-[#0000ff] mb-3" />
                    <p className="font-bold text-gray-900 text-center mb-1">
                      {receiptFile ? 'Receipt Uploaded' : 'Upload Receipt Image'}
                    </p>
                    {receiptFile && (
                      <p className="text-sm text-gray-600">{receiptFile.name}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleProceed}
                  disabled={isVerifying}
                  className="w-full bg-[#0000ff] text-white font-bold py-4 rounded-2xl hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      VERIFYING PAYMENT...
                    </>
                  ) : (
                    'VERIFY PAYMENT'
                  )}
                </button>
                <button
                  onClick={() => setStep('payment')}
                  disabled={isVerifying}
                  className="w-full bg-gray-200 text-gray-900 font-bold py-4 rounded-2xl hover:bg-gray-300 transition disabled:opacity-50"
                >
                  Back
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="bg-green-50 rounded-3xl p-8 text-center mb-6">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-20 h-20 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your BPC code has been verified and is now active on your account.
              </p>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 text-left mb-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Amount</p>
                    <p className="font-bold text-gray-900">NGN {amount.toLocaleString()}.00</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Transaction ID</p>
                    <p className="font-mono font-bold text-[#0000ff]">TXN20260517001</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Status</p>
                    <p className="font-bold text-green-600">Verified</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Time</p>
                    <p className="font-bold text-gray-900">May 17, 2026 • 08:19 AM</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-[#0000ff] text-white font-bold py-4 rounded-2xl hover:opacity-90 transition"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => router.push('/transactions')}
                  className="w-full bg-gray-200 text-gray-900 font-bold py-4 rounded-2xl hover:bg-gray-300 transition"
                >
                  View Transactions
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
