'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  Building2,
  UploadCloud,
  FileCheck,
  AlertTriangle,
  Volume2,
  Loader2,
  XCircle,
  MessageCircle,
  Mail,
  Home,
} from 'lucide-react'

export default function BuyBPCPage() {
  const router = useRouter()
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [receiptImage, setReceiptImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Verification state machine
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [showErrorModal, setShowErrorModal] = useState(false)

  // Support links - update these with your actual details
  const TELEGRAM_LINK = 'https://t.me/available247_1'
  const GMAIL_LINK = 'mailto:lilog2025@gmail.com'

  // Payment bank details
  const bankDetails = {
    bankName: 'Paga Bank',
    accountNumber: '1234567890',
    accountName: 'THE BOSS',
    bpcRate: '₦10,500 for the BPC Code',
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(true)
    setTimeout(() => setCopiedAccount(false), 2000)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handlePlayWarning = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(
        'Please DO NOT use Opay to make payments. Opay transactions may not be processed correctly. Use other banks for successful transfers.'
      )
      speech.rate = 0.9
      window.speechSynthesis.speak(speech)
    } else {
      alert('Audio warning is not supported on this device.')
    }
  }

  const handleSubmit = () => {
    if (!receiptImage) {
      alert('Please upload your payment receipt before submitting.')
      return
    }

    setIsVerifying(true)
    setCountdown(10)
  }

  // 10-second timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isVerifying && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (isVerifying && countdown === 0) {
      setIsVerifying(false)
      setShowErrorModal(true)
    }

    return () => clearTimeout(timer)
  }, [isVerifying, countdown])

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* 1. Initial Opay Warning Modal */}
      {showWarningModal && !isVerifying && !showErrorModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-amber-500" />
            </div>

            <h2 className="text-xl font-bold text-red-600">Important Notice</h2>

            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              Please <strong className="text-gray-900">DO NOT use Opay</strong> to make payments.
              Opay transactions may not be processed correctly. Use other banks for successful transfers.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handlePlayWarning}
                className="flex-1 bg-blue-600 text-white text-xs font-semibold py-3 px-2 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                Play Warning
              </button>

              <button
                onClick={() => setShowWarningModal(false)}
                className="flex-1 bg-emerald-500 text-white text-xs font-semibold py-3 px-2 rounded-xl hover:bg-emerald-600 transition shadow-sm"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Fullscreen 10-Second Loading Overlay */}
      {isVerifying && (
        <div className="fixed inset-0 z-[110] bg-white flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-20 h-20 text-teal-500 animate-spin" />
            <span className="absolute font-bold text-lg text-teal-700">{countdown}s</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Confirming Payment...</h2>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">
              Please wait while our system verifies your payment receipt details.
            </p>
          </div>

          <div className="w-48 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${((10 - countdown) / 10) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 3. Payment Not Confirmed Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-red-600">Payment Not Confirmed</h2>

            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              We couldn’t automatically confirm your payment receipt. Please contact customer support for immediate manual verification.
            </p>

            <div className="space-y-2 pt-2">
              {/* Telegram Button */}
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-600 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support on Telegram
              </a>

              {/* Email Button */}
              <a
                href={GMAIL_LINK}
                className="w-full bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5 text-gray-600" />
                Send Email Support
              </a>

              {/* Go to Homepage Button */}
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-black transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Home className="w-5 h-5" />
                Go to Homepage
              </button>

              {/* Retry / Close */}
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full text-xs text-gray-400 font-medium py-2 hover:text-gray-600"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-3 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Buy BPC Code</h1>
          <div className="w-5" />
        </div>
      </header>

      <main className="px-3 py-4 max-w-2xl mx-auto space-y-4">
        {/* Instruction Banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-sm text-teal-900">
          <p className="font-semibold mb-1">How to purchase:</p>
          <p>
            1. Transfer payment to the account below.<br />
            2. Upload a screenshot or photo of your payment receipt.<br />
            3. Click <strong>Submit Receipt</strong> to confirm.
          </p>
        </div>

        {/* Pricing Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-3">Package Details</h2>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">BPC Rate</span>
            <span className="font-bold text-gray-900">{bankDetails.bpcRate}</span>
          </div>
        </div>

        {/* Bank Payment Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-teal-500" />
            <h2 className="font-bold text-gray-900">Payment Account</h2>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-gray-600 text-sm font-medium">Bank Name</span>
            <span className="font-semibold text-gray-900">{bankDetails.bankName}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-gray-600 text-sm font-medium">Account Number</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg text-gray-900">
                {bankDetails.accountNumber}
              </span>
              <button
                onClick={() => handleCopy(bankDetails.accountNumber)}
                className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 transition"
              >
                {copiedAccount ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm font-medium">Account Name</span>
            <span className="font-semibold text-gray-900 text-right">{bankDetails.accountName}</span>
          </div>
        </div>

        {/* Receipt Upload Box */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h2 className="font-bold text-gray-900">Upload Payment Receipt</h2>

          <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition bg-gray-50 relative overflow-hidden">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />

            {previewUrl ? (
              <div className="flex flex-col items-center gap-2">
                <img 
                  src={previewUrl} 
                  alt="Receipt Preview" 
                  className="max-h-48 rounded-lg object-contain border border-gray-200" 
                />
                <div className="flex items-center gap-1 text-sm font-medium text-teal-600 mt-2">
                  <FileCheck className="w-4 h-4" />
                  <span>{receiptImage?.name}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <UploadCloud className="w-10 h-10 text-teal-500" />
                <span className="text-sm font-semibold text-gray-700">Click to upload receipt screenshot</span>
                <span className="text-xs text-gray-400">PNG, JPG, or JPEG</span>
              </div>
            )}
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-teal-500 text-white font-bold py-3.5 rounded-full hover:bg-teal-600 transition shadow-md"
        >
          Submit Receipt
        </button>
      </main>
    </div>
  )
}
