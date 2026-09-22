'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Check, AlertCircle } from 'lucide-react'

export default function BuyPayflexCodePage() {
  const router = useRouter()
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [copiedBank, setCopiedBank] = useState(false)
  const [copiedName, setCopiedName] = useState(false)
  const [proofSubmitted, setProofSubmitted] = useState(false)

  const accountNumber = "1011052972"
  const bankName = "KongaPay"
  const accountName = "Oluwatobiloba Esther"

  const handleCopy = (text: string, type: 'account' | 'bank' | 'name') => {
    navigator.clipboard.writeText(text)
    if (type === 'account') {
      setCopiedAccount(true)
      setTimeout(() => setCopiedAccount(false), 2000)
    } else if (type === 'bank') {
      setCopiedBank(true)
      setTimeout(() => setCopiedBank(false), 2000)
    } else {
      setCopiedName(true)
      setTimeout(() => setCopiedName(false), 2000)
    }
  }

  const handleSubmitProof = () => {
    setProofSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-12">
      <header className="bg-[#181a20] border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 text-white/80 hover:bg-white/10 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-white">Buy PayFlex Code</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-5">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 space-y-1">
            <p className="font-bold text-amber-100">Payment Instructions</p>
            <p>Transfer the exact amount to the account details below. Please <strong>do not use OPay</strong> to make payment.</p>
          </div>
        </div>

        <div className="bg-[#1a1c23] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
            Bank Transfer Details
          </h3>

          <div className="space-y-3">
            <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/50 uppercase">Bank Name</p>
                <p className="font-bold text-sm text-white">{bankName}</p>
              </div>
              <button 
                onClick={() => handleCopy(bankName, 'bank')}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
              >
                {copiedBank ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/70" />}
                <span>{copiedBank ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/50 uppercase">Account Number</p>
                <p className="font-bold text-base text-blue-400 tracking-wider">{accountNumber}</p>
              </div>
              <button 
                onClick={() => handleCopy(accountNumber, 'account')}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
              >
                {copiedAccount ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/70" />}
                <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/50 uppercase">Account Name</p>
                <p className="font-bold text-sm text-white">{accountName}</p>
              </div>
              <button 
                onClick={() => handleCopy(accountName, 'name')}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
              >
                {copiedName ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/70" />}
                <span>{copiedName ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {proofSubmitted ? (
            <div className="bg-green-500/20 border border-green-500/40 rounded-2xl p-4 text-center space-y-2">
              <Check className="w-8 h-8 text-green-400 mx-auto" />
              <p className="text-sm font-bold text-green-200">Payment Proof Submitted</p>
              <p className="text-xs text-green-300/80">Your PayFlex Code will be sent or verified shortly after confirmation.</p>
            </div>
          ) : (
            <button
              onClick={handleSubmitProof}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg transition duration-200"
            >
              I Have Made Payment
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
