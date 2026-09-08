'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2, Search, ChevronDown, Copy, Check, Home } from 'lucide-react'

const NIGERIAN_BANKS = [
  "Access Bank", "Access Bank (Diamond)", "Citibank Nigeria", "Ecobank Nigeria", 
  "Fidelity Bank", "First Bank of Nigeria", "First City Monument Bank (FCMB)", 
  "Globus Bank", "Guaranty Trust Bank (GTB)", "Heritage Bank", "Jaiz Bank", 
  "Keystone Bank", "Polaris Bank", "Providus Bank", "Stanbic IBTC Bank", 
  "Standard Chartered Bank", "Sterling Bank", "Suntrust Bank", "TAJ Bank", 
  "Titan Trust Bank", "Union Bank of Nigeria", "United Bank for Africa (UBA)", 
  "Unity Bank", "Wema Bank", "Zenith Bank", "Lotus Bank", "Optimus Bank", "Parallex Bank",
  "Carbon", "KongaPay", "Sparkle", "Kuda Bank", "Moniepoint MFB", "Opay Digital Services", 
  "Palmpay", "Fairmoney Microfinance Bank", "VFD MFB", "Mint MFB", "Raven MFB", "Imowo MFB", 
  "Paga", "Pocket App", "GoMoney", "Eyowo", "Hope PSB", "Momo PSB", "Moneymaster PSB", 
  "Airtel Smartcash PSB", "9Payment Service Bank",
  "Coronation Merchant Bank", "FBNQuest Merchant Bank", "Rand Merchant Bank", "Nova Merchant Bank", 
  "Greenwich Merchant Bank", "FSDH Merchant Bank", "Meristem Registrar",
  "Abbey Mortgage Bank", "Citycode Mortgage Bank", "FHA Mortgage Bank", "First Savings Mortgage Bank", 
  "Haggai Mortgage Bank", "Infinity Trust Mortgage Bank", "Jubilee Life Mortgage Bank", 
  "Livingtrust Mortgage Bank", "Lagos Building Investment Company (LBIC)", "Niger Delta Mortgage Bank", 
  "Refuge Mortgage Bank", "Brent Mortgage Bank", "Gateway Mortgage Bank", "Imperial Mortgage Bank", 
  "Delta Trust Mortgage Bank", "Coop Savings & Mortgage", "FBN Mortgages", "Infinity Mortgage", "ASO Savings and Loans", "Cooperative Mortgage Bank",
  "Above Only MFB", "Absolute MFB", "Abulesoro MFB", "Acumen MFB", "Adebimpe MFB", "Adeyemi College MFB", 
  "Afrinvest MFB", "Afriglobal MFB", "Ahmadu Bello University MFB", "Aleyo MFB", "Alpha MFB", 
  "AMAC MFB", "Amegy MFB", "Amju Unique MFB", "Apoch MFB", "Arao MFB", "Arc MFB", "Asset Matrix MFB", 
  "Astrapolaris MFB", "Attractive MFB", "Baines Credit MFB", "Balogun Gambari MFB", "BC Kash MFB", 
  "BIPC MFB", "BOCTRUST MFB", "Borgu MFB", "Bosak MFB", "Bowen Microfinance Bank", "Brent MFB", 
  "CASHIO MFB", "Catedral MFB", "Cellulant", "CEMCS MFB", "Chikum MFB", "Citimaster MFB", 
  "Citizen MFB", "Chibueze MFB", "Corestep MFB", "Covenant MFB", "Crescent MFB", "Crust MFB", 
  "E-Barclays MFB", "Eagle Flight MFB", "Eaglet MFB", "Eclat MFB", "Ed financeiros", "Ekimogun MFB", 
  "Ekondo MFB", "Emerald MFB", "Empire MFB", "Enthroned MFB", "Erad MFB", "Esan MFB", "Etranzact", 
  "Evangel MFB", "Everest MFB", "FADAM MFB", "FCMB Easy", "Federal Polytechnic Nekede MFB", 
  "Fina Trust MFB", "Finca MFB", "First Royal MFB", "FIRS MFB", "Fortis MFB", "Fountain MFB", 
  "Futo MFB", "Garki MFB", "Gateway MFB", "GIWIRE MFB", "Global MFB", "Goodnews MFB", "Gowans MFB", 
  "Green Energy MFB", "Greenville MFB", "Grooming MFB", "Guide MFB", "Hadassah MFB", "Hasal MFB", 
  "Headway MFB", "HighStreet MFB", "IBILE MFB", "Ikire MFB", "ILARO MFB", "ILISAN MFB", "Infinity MFB", 
  "Innovectives Kesh", "Insight MFB", "Interland MFB", "Isaleoyo MFB", "Izon MFB", "Kadpoly MFB", 
  "Kano MFB", "Kwasu MFB", "La Fayette MFB", "Lapo MFB", "Lavender MFB", "Legend MFB", "LetMGo MFB", 
  "Likkay MFB", "Mainland MFB", "Malachy MFB", "Mansa MFB", "Marach MFB", "Matrix MFB", "Megapraise MFB", 
  "Microcred MFB", "Midland MFB", "Model MFB", "Mutual Trust MFB", "Nagarta MFB", "Navy MFB", 
  "NDCC MFB", "New Dawn MFB", "New General MFB", "NIP Virtual Bank", "NIRSAL MFB", "Nnewi MFB", 
  "Nova MFB", "Npf MFB", "Oak MFB", "Ohafia MFB", "Okpoga MFB", "Olowolagba MFB", "Omiye MFB", 
  "Omoluabi MFB", "Orisun MFB", "Pace MFB", "Patrick Gold MFB", "Peace MFB", "PECANTRUST MFB", 
  "Pennywise MFB", "Personal Trust MFB", "Petra MFB", "Pillar MFB", "Platinum MFB", "Praco MFB", 
  "Premier MFB", "Prestigious MFB", "Prudent MFB", "Safe Haven MFB", "Sage MFB", "Shield MFB", 
  "Solid Rock MFB", "Spectrum MFB", "Standard MFB", "Stellas MFB", "Supreme MFB", "Tanadi MFB", 
  "Tcf MFB", "TeamApt", "Tehila MFB", "Topshield MFB", "Trident MFB", "Trust MFB", "TrustBanc MFB", 
  "Unical MFB", "Unilag MFB", "UNN MFB", "Uzondu MFB", "Vale MFB", "Visa MFB", "Woori MFB", 
  "Xpress Payments", "Yobe MFB", "Zikora MFB"
]

const CORRECT_PAYFLEX_CODE = 'Payflex0102'

export default function WithdrawPage() {
  const router = useRouter()
  const [balance, setBalance] = useState<number>(0)
  const [amount, setAmount] = useState<string>('')
  
  const [bank, setBank] = useState<string>('')
  const [bankSearchQuery, setBankSearchQuery] = useState<string>('')
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState<boolean>(false)
  const bankDropdownRef = useRef<HTMLDivElement>(null)

  const [accountNumber, setAccountNumber] = useState<string>('')
  const [accountName, setAccountName] = useState<string>('')
  const [payflexCode, setPayflexCode] = useState<string>('')
  const [showCode, setShowCode] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  
  // Receipt popup state
  const [showReceipt, setShowReceipt] = useState<boolean>(false)
  const [transactionRef, setTransactionRef] = useState<string>('')
  const [copiedRef, setCopiedRef] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedBalance = localStorage.getItem('user_available_balance')
    if (storedBalance) {
      setBalance(parseFloat(storedBalance))
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(event.target as Node)) {
        setIsBankDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredBanks = NIGERIAN_BANKS.filter(b => 
    b.toLowerCase().includes(bankSearchQuery.toLowerCase())
  )

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString())
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const withdrawVal = parseFloat(amount)
    if (!withdrawVal || withdrawVal <= 0) {
      setError('Please enter a valid withdrawal amount.')
      return
    }
    if (withdrawVal > balance) {
      setError('Insufficient available balance.')
      return
    }
    if (!bank) {
      setError('Please select a destination bank or PSB.')
      return
    }
    if (!accountNumber || accountNumber.length !== 10) {
      setError('Please enter a valid 10-digit account number.')
      return
    }
    if (!accountName) {
      setError('Please enter the account holder name.')
      return
    }

    const cleanCode = payflexCode.trim()
    if (!cleanCode) {
      setError('PayFlex Code is mandatory to process withdrawals.')
      return
    }

    if (cleanCode !== CORRECT_PAYFLEX_CODE) {
      setError('Wrong Bank Processing Code (PayFlexCode CODE). Kindly get the correct code to proceed with the transaction.')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const newBalance = balance - withdrawVal
      setBalance(newBalance)
      localStorage.setItem('user_available_balance', newBalance.toString())
      
      // Generate a random transaction reference ID for the receipt
      const randomRef = 'TRX-' + Math.floor(100000000 + Math.random() * 900000000)
      setTransactionRef(randomRef)

      setIsLoading(false)
      setShowReceipt(true) // Open the success receipt view immediately
    }, 1500)
  }

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transactionRef)
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white pb-12 flex flex-col items-center relative">
      {/* Success Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#00B67A]" />
            </div>

            <h2 className="text-lg font-bold text-white">Withdrawal Successful!</h2>
            <p className="text-xs text-white/60">
              Your funds have been transferred successfully to your account.
            </p>

            <div className="bg-[#121212] p-4 rounded-2xl border border-[#2a2a2a] space-y-2 text-left text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">Amount:</span>
                <span className="font-bold text-white">₦{parseFloat(amount || '0').toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Bank:</span>
                <span className="font-bold text-white">{bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Account Number:</span>
                <span className="font-bold text-white">{accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Account Name:</span>
                <span className="font-bold text-white">{accountName}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#2a2a2a]">
                <span className="text-white/50">Reference:</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[#00B67A] font-bold">{transactionRef}</span>
                  <button onClick={handleCopyRef} className="p-1 hover:text-white text-white/60 transition">
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-[#00B67A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-[#00B67A] text-black font-bold py-3 rounded-xl text-xs hover:bg-[#00a36d] transition flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="w-full bg-black border-b border-[#222] sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 text-white/80 hover:bg-[#1c1c1c] rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-white tracking-wide">Withdraw Funds</h1>
        </div>
      </header>

      <main className="w-full max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="flex gap-2 mb-2">
          <div className="h-1 bg-white flex-1 rounded-full"></div>
          <div className="h-1 bg-[#222] flex-1 rounded-full"></div>
          <div className="h-1 bg-[#222] flex-1 rounded-full"></div>
        </div>

        <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 shadow-2xl space-y-5">
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 font-bold">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded-2xl py-3.5 pl-9 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-white transition"
                />
              </div>
              <p className="text-xs text-white/50 mt-1.5">
                Available balance: NGN{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/50 mb-2">Quick amounts</p>
              <div className="grid grid-cols-4 gap-2">
                {[5000, 10000, 25000, 50000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    className="bg-[#1c1c1c] border border-[#333] hover:border-white py-2 rounded-xl text-xs font-bold text-white transition"
                  >
                    ₦{val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative" ref={bankDropdownRef}>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Select Bank or PSB (220 Institutions)
              </label>
              <div 
                onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-2xl py-3.5 px-4 text-white flex items-center justify-between cursor-pointer focus:border-white transition"
              >
                <span className={bank ? 'text-white font-medium' : 'text-white/30'}>
                  {bank || 'Search Carbon, KongaPay, Sparkle...'}
                </span>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isBankDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isBankDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c1c1c] border border-[#333] rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-[#333] flex items-center gap-2">
                    <Search className="w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={bankSearchQuery}
                      onChange={(e) => setBankSearchQuery(e.target.value)}
                      placeholder="Search Carbon, KongaPay, Sparkle..."
                      className="w-full bg-transparent text-white text-xs placeholder-white/30 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-[#262626]">
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map((bName) => (
                        <div
                          key={bName}
                          onClick={() => {
                            setBank(bName)
                            setIsBankDropdownOpen(false)
                            setBankSearchQuery('')
                          }}
                          className="py-3 px-4 text-xs text-white/80 hover:bg-[#262626] cursor-pointer transition"
                        >
                          {bName}
                        </div>
                      ))
                    ) : (
                      <div className="py-4 px-4 text-xs text-white/40 text-center">
                        No matching bank found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Account Number
              </label>
              <input
                type="text"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="10 digit account number"
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-2xl py-3.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Full name as shown on account"
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-2xl py-3.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-white transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider">
                  INPUT PAYFLEX CODE
                </label>
                <button
                  type="button"
                  onClick={() => router.push('/buy-payflex-code')}
                  className="text-xs text-white font-bold hover:underline"
                >
                  Buy PayFlex Code
                </button>
              </div>
              <div className="relative">
                <input
                  type={showCode ? 'text' : 'password'}
                  value={payflexCode}
                  onChange={(e) => setPayflexCode(e.target.value)}
                  placeholder="Enter valid PayFlex Code"
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded-2xl py-3.5 pl-4 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
                >
                  {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-xs text-red-200">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-white/90 text-black font-bold py-4 rounded-2xl shadow-lg transition duration-200 disabled:opacity-50 mt-6 tracking-wide"
            >
              {isLoading ? 'Verifying & Processing...' : 'PROCEED TO WITHDRAW'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
