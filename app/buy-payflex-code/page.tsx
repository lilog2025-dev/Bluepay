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
  MessageCircle,
  Mail,
  Home,
  Loader2,
  XCircle,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function BuyPayFlexCodePage() {
  const router = useRouter()
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [receiptImage, setReceiptImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  // Code and visibility state
  const [payFlexCode, setPayFlexCode] = useState('')
  const [showCode, setShowCode] = useState(false)

  // Verification states
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [showFailedModal, setShowFailedModal] = useState(false)

  // Static Manual Bank Details
  const MANUAL_BANK = {
    bankName: 'Paga',
    accountNumber: '1234567890',
    accountName: 'David Ada',
    PayFlexCodeRate: '₦10,500 for the PayFlex Code',
  }

  const TELEGRAM_LINK = 'https://t.me/available247_1'
  const GMAIL_LINK = 'mailto:lilog2025@gmail.com'

  // Handle 10-second timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isVerifying && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (isVerifying && countdown === 0) {
      setIsVerifying(false)
      setShowFailedModal(true)
    }
    return () => clearTimeout(timer)
  }, [isVerifying, countdown])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!receiptImage) {
      alert('Please upload your payment receipt before submitting.')
      return
    }

    // Start 10-second verification simulation
    setCountdown(10)
    setIsVerifying(true)
  }

  const handleTryAgain = () => {
    setShowFailedModal(false)
    setIsVerifying(false)
    setCountdown(10)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 relative">
      {/* 1. Opay Warning Modal */}
      {showWarningModal && !isVerifying && !showFailedModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl p-4 max-w-xs w-full shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-amber-500" />
            </div>

            <h2 className="text-lg font-bold text-red-600">Important Notice</h2>

            <p className="text-xs text-gray-700 font-medium leading-relaxed">
              Please <strong className="text-gray-900">DO NOT use Opay</strong> to make payments.
              Opay transactions may not be processed correctly.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handlePlayWarning}
                className="flex-1 bg-blue-600 text-white text-xs font-semibold py-2 px-1.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1 shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Play
              </button>

              <button
                onClick={() => setShowWarningModal(false)}
                className="flex-1 bg-emerald-500 text-white text-xs font-semibold py-2 px-1.5 rounded-lg hover:bg-emerald-600 transition shadow-sm"
              >
                Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Verifying Payment Loading Modal (10 Seconds) */}
      {isVerifying && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <Loader2 className="w-16 h-16 text-teal-500 animate-spin" />
              <span className="absolute font-bold text-teal-700 text-base">{countdown}s</span>
            </div>

            <h2 className="text-lg font-bold text-gray-900">Verifying Payment...</h2>

            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Please wait while our system checks for your transfer receipt confirmation.
            </p>
          </div>
        </div>
      )}

      {/* 3. Payment Not Confirmed Modal */}
      {showFailedModal && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl p-4 max-w-xs w-full shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7 text-red-600" />
            </div>

            <h2 className="text-lg font-bold text-gray-900">Payment Not Confirmed</h2>

            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Automatic verification could not detect your transfer yet. Please contact support with your receipt or try again.
            </p>

            <div className="space-y-2 pt-1">
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-500 text-white font-semibold text-xs py-2.5 px-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support (Telegram)
              </a>

              <a
                href={GMAIL_LINK}
                className="w-full bg-gray-100 text-gray-800 font-semibold text-xs py-2.5 px-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-gray-600" />
                Email Support
              </a>

              <button
                onClick={handleTryAgain}
                className="w-full bg-teal-500 text-white font-semibold text-xs py-2.5 px-3 rounded-lg hover:bg-teal-600 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gray-900 text-white font-semibold text-xs py-2.5 px-3 rounded-lg hover:bg-black transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Home className="w-4 h-4" />
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-2.5 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Buy PayFlex Code</h1>
          <div className="w-5" />
        </div>
      </header>

      <main className="px-3 py-3 max-w-lg mx-auto space-y-3">
        {/* Instruction Banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs text-teal-900">
          <p className="font-semibold mb-0.5">How to purchase:</p>
          <p className="leading-tight">
            1. Transfer payment to the official account.<br />
            2. Upload a photo of your receipt.<br />
            3. Click <strong>Submit Receipt</strong> to verify.
          </p>
        </div>

        {/* Pricing Details */}
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 font-medium">PayFlex Rate</span>
            <span className="font-bold text-gray-900 text-sm">{MANUAL_BANK.PayFlexCodeRate}</span>
          </div>
        </div>

        {/* Input PayFlex Code Section matching your screenshot */}
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm space-y-2">
          <label className="font-bold text-gray-900 text-xs tracking-wide block uppercase">
            INPUT PayFlex Code
          </label>
          <div className="relative flex items-center">
            <input 
              type={showCode ? "text" : "password"} 
              value={payFlexCode}
              onChange={(e) => setPayFlexCode(e.target.value)}
              placeholder="Enter PayFlex Code" 
              className="w-full px-3 py-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 font-mono pr-10"
            />
            <button 
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Static Manual Bank Details */}
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm space-y-2.5 text-xs">
          <div className="flex items-center gap-1.5 pb-1 border-b border-gray-100">
            <Building2 className="w-4 h-4 text-teal-500" />
            <h2 className="font-bold text-gray-900 text-sm">Payment Account Details</h2>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Bank Name</span>
            <span className="font-bold text-gray-900">{MANUAL_BANK.bankName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Account Number</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-base text-gray-900">
                {MANUAL_BANK.accountNumber}
              </span>
              <button
                onClick={() => handleCopy(MANUAL_BANK.accountNumber)}
                className="p-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700 transition"
              >
                {copiedAccount ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-gray-100">
            <span className="text-gray-600 font-medium">Account Name</span>
            <span className="font-bold text-gray-900">{MANUAL_BANK.accountName}</span>
          </div>
        </div>

        {/* Receipt Upload Box */}
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm space-y-2">
          <h2 className="font-bold text-gray-900 text-xs">Upload Payment Receipt</h2>

          <label className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition bg-gray-50 relative overflow-hidden">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />

            {previewUrl ? (
              <div className="flex flex-col items-center gap-1">
                <img 
                  src={previewUrl} 
                  alt="Receipt Preview" 
                  className="max-h-32 rounded object-contain border border-gray-200" 
                />
                <div className="flex items-center gap-1 text-xs font-medium text-teal-600 mt-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{receiptImage?.name}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-center">
                <UploadCloud className="w-7 h-7 text-teal-500" />
                <span className="text-xs font-semibold text-gray-700">Click to upload receipt photo</span>
                <span className="text-[10px] text-gray-400">PNG, JPG, or JPEG</span>
              </div>
            )}
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-teal-500 text-white font-bold py-3 rounded-xl text-sm hover:bg-teal-600 transition shadow-sm"
        >
          Submit Receipt
        </button>
      </main>
    </div>
  )
}
