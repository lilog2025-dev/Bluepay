'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Eye,
  EyeOff,
  Headphones,
  BarChart2,
  Gamepad2,
  Zap,
  Calendar,
  Users,
  HelpCircle,
  User,
  Plus,
  CreditCard,
  Wifi,
  Play,
  CheckCircle2,
} from 'lucide-react'
import { getBalance, updateBalance } from '@/lib/balance-store'
import { createClient } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const [balance, setBalance] = useState<number>(4000)
  const [showBalance, setShowBalance] = useState<boolean>(true)
  const [fullName, setFullName] = useState<string>('Lilog2025')

  // Mining States
  const [isMining, setIsMining] = useState(false)
  const [minedAmount, setMinedAmount] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const DAILY_LIMIT = 250000

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if it's a new day to reset mining
    const lastMiningDate = localStorage.getItem('lastMiningDate')
    const todayStr = new Date().toDateString()
    if (lastMiningDate !== todayStr) {
      localStorage.setItem('lastMiningDate', todayStr)
      localStorage.setItem('minedToday', '0')
      localStorage.setItem('miningCompleted', 'false')
    }

    // Load initial mining storage data
    const savedProgress = localStorage.getItem('minedToday')
    const savedStatus = localStorage.getItem('miningCompleted')
    if (savedProgress) setMinedAmount(parseFloat(savedProgress))
    if (savedStatus === 'true') setIsCompleted(true)

    // Load initial balance safely
    if (typeof getBalance === 'function') {
      const currentBal = getBalance()
      setBalance(currentBal)
    }

    const handleBalanceChange = () => {
      if (typeof getBalance === 'function') {
        setBalance(getBalance())
      }
    }

    window.addEventListener('balanceChange', handleBalanceChange)

    const loadUser = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single()
          if (profile?.full_name) {
            setFullName(profile.full_name)
          }
        }
      } catch (err) {
        const storedName = sessionStorage.getItem('signupFullName')
        if (storedName) setFullName(storedName)
      }
    }
    loadUser()

    return () => {
      window.removeEventListener('balanceChange', handleBalanceChange)
    }
  }, [])

  // Mining increment effect that directly updates balance store and state
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isMining && minedAmount < DAILY_LIMIT) {
      interval = setInterval(() => {
        setMinedAmount((prev) => {
          const increment = 2500 // Chunk size per tick
          const nextVal = prev + increment
          
          if (nextVal >= DAILY_LIMIT) {
            const finalChunk = DAILY_LIMIT - prev
            setIsMining(false)
            setIsCompleted(true)
            localStorage.setItem('miningCompleted', 'true')
            localStorage.setItem('minedToday', DAILY_LIMIT.toString())
            localStorage.setItem('lastMiningDate', new Date().toDateString())
            
            // Add final chunk directly to balance store
            if (typeof updateBalance === 'function' && finalChunk > 0) {
              const current = typeof getBalance === 'function' ? getBalance() : balance
              const newTotal = current + finalChunk
              updateBalance(newTotal)
              setBalance(newTotal)
            }
            return DAILY_LIMIT
          }

          // Add intermediate increment to balance store
          if (typeof updateBalance === 'function') {
            const current = typeof getBalance === 'function' ? getBalance() : balance
            const newTotal = current + increment
            updateBalance(newTotal)
            setBalance(newTotal)
          }

          localStorage.setItem('minedToday', nextVal.toString())
          return nextVal
        })
      }, 400)
    }
    return () => clearInterval(interval)
  }, [isMining, minedAmount, balance])

  const startMining = () => {
    if (isCompleted) return
    setIsMining(true)
  }

  const progressPercentage = (minedAmount / DAILY_LIMIT) * 100

  return (
    <div className="min-h-screen bg-gray-50 pb-24 text-gray-900">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold text-lg relative">
              {fullName.charAt(0).toUpperCase()}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Good Day</p>
              <h1 className="text-sm font-bold text-gray-900">{fullName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Daily Mining Card */}
        <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-xl text-[#0000ff]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Daily Allocation Mining</h3>
                <p className="text-xs text-gray-500">Tap to mine your daily NGN 250,000</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#0000ff] bg-blue-50 px-2.5 py-1 rounded-full">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>

          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-3">
            <div 
              className="bg-[#0000ff] h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500">Mined Value</span>
            <span className="font-bold text-gray-900 text-base">
              ₦{minedAmount.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ ₦250,000</span>
            </span>
          </div>

          {!isCompleted ? (
            <button
              onClick={startMining}
              disabled={isMining}
              className="w-full bg-[#0000ff] text-white font-bold py-2.5 rounded-xl hover:opacity-95 transition flex items-center justify-center gap-2 text-sm disabled:opacity-70 shadow-md"
            >
              {isMining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mining in progress...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Start Mining Today's Allocation
                </>
              )}
            </button>
          ) : (
            <div className="w-full bg-green-50 text-green-700 border border-green-200 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Mining Completed for Today (Resets Tomorrow)
            </div>
          )}
        </div>

        {/* Balance Card */}
        <div className="bg-[#0000ff] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-blue-200 font-medium uppercase tracking-wider">Available Balance</p>
              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-2xl font-extrabold tracking-tight">
                  {showBalance ? `NGN ${balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '₦ *****'}
                </h2>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-blue-200 hover:text-white transition"
                >
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button 
              onClick={() => router.push('/withdraw')}
              className="bg-white text-[#0000ff] font-bold text-xs px-4 py-2 rounded-full shadow hover:bg-blue-50 transition"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => router.push('/buy-payflex-code')}
            className="bg-amber-400 hover:bg-amber-500 text-gray-900 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-md transition"
          >
            <CreditCard className="w-6 h-6 mb-2 text-gray-900" />
            <span className="text-xs font-bold leading-tight">BUY<br />PayFlexCode</span>
          </button>

          <button
            onClick={() => router.push('/airtime')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-md transition"
          >
            <PhoneIcon className="w-6 h-6 mb-2 text-white" />
            <span className="text-xs font-bold leading-tight mt-1">AIRTIME</span>
          </button>

          <button
            onClick={() => router.push('/data')}
            className="bg-slate-700 hover:bg-slate-800 text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-md transition"
          >
            <Wifi className="w-6 h-6 mb-2 text-white" />
            <span className="text-xs font-bold leading-tight mt-1">DATA</span>
          </button>
        </div>

        {/* More Services */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">More Services</h3>
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => router.push('/support')}
              className="bg-sky-400 hover:bg-sky-500 text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm transition aspect-square"
            >
              <Headphones className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">SUPPORT</span>
            </button>

            <button
              onClick={() => router.push('/data-review')}
              className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm transition aspect-square"
            >
              <BarChart2 className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold leading-tight">DATA<br />REVIEW</span>
            </button>

            <button
              onClick={() => router.push('/betting')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm transition aspect-square"
            >
              <Gamepad2 className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">BETTING</span>
            </button>

            <button
              onClick={() => router.push('/electricity')}
              className="bg-stone-600 hover:bg-stone-700 text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm transition aspect-square"
            >
              <Zap className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold leading-tight">ELECTRICITY</span>
            </button>
          </div>
        </div>

        {/* Recent Activity / Promo Space */}
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl h-28 w-full shadow-inner flex items-center justify-center text-gray-500 font-medium text-sm">
          Quick Service Hub
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => router.push('/calendar')}
            className="flex flex-col items-center text-gray-500 hover:text-[#0000ff]"
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Calendar</span>
          </button>

          <button
            onClick={() => router.push('/social')}
            className="flex flex-col items-center text-gray-500 hover:text-[#0000ff]"
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Social</span>
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-12 h-12 bg-[#0000ff] text-white rounded-full flex items-center justify-center shadow-lg -mt-4 border-4 border-white"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button
            onClick={() => router.push('/support')}
            className="flex flex-col items-center text-gray-500 hover:text-[#0000ff]"
          >
            <HelpCircle className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Support</span>
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="flex flex-col items-center text-gray-500 hover:text-[#0000ff]"
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

function PhoneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0_1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
