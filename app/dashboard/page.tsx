'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CreditCard, 
  Phone, 
  Wifi, 
  Headphones, 
  Users, 
  DollarSign, 
  BarChart2, 
  Dices, 
  Tv, 
  Zap, 
  Share2, 
  Eye, 
  EyeOff, 
  Bell, 
  Calendar, 
  MessageSquare, 
  Plus, 
  User, 
  HelpCircle 
} from 'lucide-react'
import { getBalance } from '@/lib/balance-store'

export default function DashboardPage() {
  const router = useRouter()
  const [balance, setBalance] = useState<number>(250000)
  const [showBalance, setShowBalance] = useState<boolean>(true)

  useEffect(() => {
    setBalance(getBalance())

    const handleBalanceChange = () => {
      setBalance(getBalance())
    }

    window.addEventListener('balanceChange', handleBalanceChange)
    window.addEventListener('storage', handleBalanceChange)

    return () => {
      window.removeEventListener('balanceChange', handleBalanceChange)
      window.removeEventListener('storage', handleBalanceChange)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Header */}
      <header className="bg-[#0000ff] text-white px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="text-white p-1">
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </button>
          <h1 className="text-xl font-bold tracking-wide">BLUEPAY</h1>
        </div>
        <button className="relative p-1">
          <Bell className="w-6 h-6 text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </header>

      {/* Main Container */}
      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Profile / Greeting Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-lg relative">
              U
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Good Day</p>
              <h2 className="text-base font-bold text-gray-900">User</h2>
            </div>
          </div>
          <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-[#0000ff] rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-blue-200 font-medium">Available Balance</p>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-2xl font-extrabold tracking-tight">
                  {showBalance
                    ? `NGN ${balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : 'NGN ••••••••'}
                </h3>
                <button onClick={() => setShowBalance(!showBalance)} className="p-1 text-blue-200 hover:text-white">
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              onClick={() => router.push('/withdraw')}
              className="bg-white text-gray-900 font-bold text-xs px-4 py-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              Withdraw
            </button>
          </div>

          {/* Allocation Progress Bar */}
          <div className="mt-4 pt-3 border-t border-blue-400/30">
            <div className="flex justify-between text-[11px] text-blue-100 mb-1">
              <span>Daily Allocation</span>
              <span className="font-semibold">NGN 250,000.00</span>
            </div>
            <div className="w-full bg-blue-800/60 h-1.5 rounded-full overflow-hidden">
              <div className="bg-white h-full w-3/4 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => router.push('/buy-bpc')}
            className="bg-amber-400 text-amber-950 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold text-xs shadow-sm hover:brightness-95 transition"
          >
            <CreditCard className="w-5 h-5" />
            <span>BUY BPC</span>
          </button>

          <button
            onClick={() => router.push('/airtime')}
            className="bg-emerald-500 text-white p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold text-xs shadow-sm hover:brightness-95 transition"
          >
            <Phone className="w-5 h-5" />
            <span>AIRTIME</span>
          </button>

          <button
            onClick={() => router.push('/data')}
            className="bg-slate-600 text-white p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold text-xs shadow-sm hover:brightness-95 transition"
          >
            <Wifi className="w-5 h-5" />
            <span>DATA</span>
          </button>
        </div>

        {/* More Services Section */}
        <div>
          <h4 className="text-xs font-bold text-gray-700 mb-2.5">More Services</h4>
          <div className="grid grid-cols-4 gap-2.5">
            <button className="bg-sky-400 text-white p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 font-semibold text-[10px] shadow-sm">
              <Headphones className="w-4 h-4" />
              <span>SUPPORT</span>
            </button>

            <button className="bg-purple-500 text-white p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 font-semibold text-[10px] shadow-sm">
              <Users className="w-4 h-4" />
              <span>GROUP</span>
            </button>

            <button className="bg-amber-400 text-amber-950 p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 font-semibold text-[10px] shadow-sm">
              <DollarSign className="w-4 h-4" />
              <span>EARN</span>
            </button>

            <button className="bg-pink-500 text-white p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 font-semibold text-[10px] shadow-sm">
              <BarChart2 className="w-4 h-4" />
              <span>DATA REVIEW</span>
            </button>

            <button className="bg-indigo-600 text-white p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 font-semibold text-[10px] shadow-sm">
              <Dices className="w-4 h-4" />
              <span>BETTING</span>
            </button>

            <button className="bg-red-500 text-white p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 font-semibold text-[10px] shadow-sm">
              <Tv className="w-4 h-4" />
              <span className="text-[9px] text-center leading-tight">TV SUBSCRIPTION</span>
            </button>

            <button className="bg-amber-600 text-white p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 font-semibold text-[10px] shadow-sm">
              <Zap className="w-4 h-4" />
              <span>ELECTRICITY</span>
            </button>

            <button className="bg-emerald-400 text-white p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 font-semibold text-[10px] shadow-sm">
              <Share2 className="w-4 h-4" />
              <span className="text-[9px] text-center leading-tight">REFER AND EARN</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center max-w-lg mx-auto z-40">
        <button className="flex flex-col items-center gap-0.5 text-blue-600 font-medium text-[10px]">
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </button>

        <button className="flex flex-col items-center gap-0.5 text-gray-400 font-medium text-[10px]">
          <MessageSquare className="w-5 h-5" />
          <span>Social</span>
        </button>

        <button className="w-10 h-10 bg-[#0000ff] text-white rounded-full flex items-center justify-center shadow-lg -mt-5">
          <Plus className="w-6 h-6" />
        </button>

        <button className="flex flex-col items-center gap-0.5 text-gray-400 font-medium text-[10px]">
          <HelpCircle className="w-5 h-5" />
          <span>Support</span>
        </button>

        <button className="flex flex-col items-center gap-0.5 text-gray-400 font-medium text-[10px]">
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </footer>
    </div>
  )
}
