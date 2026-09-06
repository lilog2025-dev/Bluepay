'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, CheckCircle2, Building2, UploadCloud, FileCheck } from 'lucide-react'

export default function BuyBPCPage() {
  const router = useRouter()
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [receiptImage, setReceiptImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Payment bank details
  const bankDetails = {
    bankName: 'Moniepoint Microfinance Bank',
    accountNumber: '6401234567', // Replace with actual account number
    accountName: 'BLUEPAY PRO SERVICES', // Replace with actual account name
    bpcRate: '₦5,000 per BPC Code',
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

  const handleSubmit = async () => {
    if (!receiptImage) {
      alert('Please upload your payment receipt before submitting.')
      return
    }

    setIsSubmitting(true)

    // Simulate submission delay or upload logic to Supabase storage
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Receipt submitted successfully! Your payment is under review.')
      router.push('/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
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
        {/* Instruction Card */}
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
          disabled={isSubmitting}
          className="w-full bg-teal-500 text-white font-bold py-3.5 rounded-full hover:bg-teal-600 transition shadow-md disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Receipt'}
        </button>
      </main>
    </div>
  )
}
