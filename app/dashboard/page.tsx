'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Wallet,
  Clock,
  User,
  Eye,
  EyeOff,
  Send,
  ShoppingCart,
  Zap,
  Radio,
  Gift,
  Users,
  Bell,
  Settings,
  LogOut,
  MoreVertical,
  CreditCard,
  TrendingUp,
  Phone,
  Tv,
  Lightbulb,
  Dices,
  BookOpen,
  Share2,
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')
  const [showBalance, setShowBalance] = useState(true)
  const [userName, setUserName] = useState('User')
  const [mounted, setMounted] = useState(false)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
    const storedName = sessionStorage.getItem('signupName')
    if (storedName) {
      const firstName = storedName.split(' ')[0]
      setUserName(firstName)
    }
  }, [])

  useEffect(() => {
    const adInterval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(adInterval)
  }, [])

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
  }

  const actionButtons = [
    { label: 'BUY BPC', icon: CreditCard, color: 'bg-purple-600' },
    { label: 'VIDEO', icon: Tv, color: 'bg-pink-600' },
    { label: 'AIRTIME', icon: Phone, color: 'bg-orange-600' },
    { label: 'DATA', icon: Radio, color: 'bg-cyan-600' },
    { label: 'SUPPORT', icon: Gift, color: 'bg-red-600' },
    { label: 'CHANNEL', icon: BookOpen, color: 'bg-green-600' },
    { label: 'BETTING', icon: Dices, color: 'bg-indigo-600' },
    { label: 'EARN MORE', icon: TrendingUp, color: 'bg-blue-600' },
    { label: 'ELECTRICITY', icon: Lightbulb, color: 'bg-yellow-600' },
    { label: 'TV', icon: Tv, color: 'bg-teal-600' },
    { label: 'ANALYTICS', icon: TrendingUp, color: 'bg-emerald-600' },
    { label: 'REFER & EARN', icon: Share2, color: 'bg-rose-600' },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header - Premium Fintech Design */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-[#0000ff] flex items-center justify-center text-white font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-500">Welcome back</p>
              <h1 className="text-base font-bold text-gray-900">
                {userName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-600 hover:text-[#0000ff] transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
            </button>
            <button className="p-2 text-gray-600 hover:text-[#0000ff] transition">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <>
            {/* Premium Balance Card - #0000FF */}
            <div className="bg-[#0000ff] rounded-3xl p-6 text-white shadow-xl mb-6">
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1">
                  <p className="text-white/70 text-sm mb-2">Available Balance</p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold">
                      {showBalance ? 'NGN 250,000.00' : '••••••'}
                    </h2>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-2 hover:bg-white/20 rounded-xl transition"
                    >
                      {showBalance ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-white/60">
                  BLUEPAY PRO V30
                </div>
                <button
                  onClick={() => router.push('/withdraw')}
                  className="px-4 py-2 bg-white text-[#0000ff] font-semibold text-xs rounded-xl hover:bg-gray-100 transition"
                >
                  WITHDRAW
                </button>
              </div>
            </div>

            {/* Advertisement Carousel */}
            <div className="mb-6 rounded-2xl overflow-hidden shadow-md h-32 bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span>Ad Slot {currentAdIndex + 1}</span>
              </div>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i === currentAdIndex ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                Quick Actions
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {actionButtons.map((btn, index) => {
                  const Icon = btn.icon
                  const handleClick = () => {
                    if (btn.label === 'AIRTIME') router.push('/airtime')
                    else if (btn.label === 'DATA') router.push('/data')
                    else if (btn.label === 'ELECTRICITY') router.push('/electricity')
                    else if (btn.label === 'TV') router.push('/tv')
                    else if (btn.label === 'BETTING') router.push('/betting')
                    // Add more navigation as pages are created
                  }
                  return (
                    <button
                      key={index}
                      onClick={handleClick}
                      className={`${btn.color} rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-90 transition text-white shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                      <p className="text-xs font-bold text-center leading-tight">
                        {btn.label}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Transaction History */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                Transaction History
              </h3>
              <div className="space-y-3">
                {[
                  {
                    type: 'Airtime Purchase',
                    recipient: 'MTN Nigeria',
                    amount: '-₦1,000',
                    txId: 'TX001',
                    time: '2 hours ago',
                    icon: Phone,
                  },
                  {
                    type: 'Data Purchase',
                    recipient: 'Airtel Nigeria',
                    amount: '-₦2,500',
                    txId: 'TX002',
                    time: '5 hours ago',
                    icon: Radio,
                  },
                  {
                    type: 'Withdrawal',
                    recipient: 'Access Bank',
                    amount: '-₦5,000',
                    txId: 'TX003',
                    time: '1 day ago',
                    icon: Send,
                  },
                ].map((transaction, index) => {
                  const Icon = transaction.icon
                  return (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-4 flex items-start justify-between hover:bg-gray-100 transition"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-[#0000ff]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <Icon className="w-5 h-5 text-[#0000ff]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {transaction.type}
                          </p>
                          <p className="text-xs text-gray-600">
                            {transaction.recipient} • {transaction.txId}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {transaction.time}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900 text-sm ml-2">
                        {transaction.amount}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'wallet' && (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Wallet
            </h2>
            <p className="text-gray-600">Coming soon</p>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Transaction History
            </h2>
            <p className="text-gray-600">View all your transactions here</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="w-20 h-20 bg-[#0000ff] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {userName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {userName}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {sessionStorage.getItem('signupEmail') || 'user@example.com'}
              </p>
              <button className="px-6 py-2 bg-[#0000ff] text-white rounded-xl hover:opacity-90 transition text-sm font-semibold">
                Edit Profile
              </button>
            </div>

            <button className="w-full bg-gray-50 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-100 transition">
              <Settings className="w-5 h-5 text-[#0000ff]" />
              <span className="font-semibold text-gray-900">
                Security Settings
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-gray-50 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-100 transition text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation - Premium Fintech Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 max-w-2xl mx-auto shadow-xl">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'home'
                ? 'text-[#0000ff] border-t-2 border-[#0000ff]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'wallet'
                ? 'text-[#0000ff] border-t-2 border-[#0000ff]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Wallet className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Wallet</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'transactions'
                ? 'text-[#0000ff] border-t-2 border-[#0000ff]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">History</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'profile'
                ? 'text-[#0000ff] border-t-2 border-[#0000ff]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
