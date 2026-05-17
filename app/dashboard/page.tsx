'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Menu,
  Bell,
  Eye,
  EyeOff,
  CreditCard,
  Play,
  Phone,
  Radio,
  Headphones,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  MessageCircle,
  Plus,
  UserCircle,
  Settings,
  LogOut,
  Dices,
  Tv,
  Lightbulb,
  Share2,
  BarChart3,
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')
  const [showBalance, setShowBalance] = useState(true)
  const [fullName, setFullName] = useState('User')
  const [userEmail, setUserEmail] = useState('')
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedName = sessionStorage.getItem('signupFullName')
    const storedEmail = sessionStorage.getItem('signupEmail')
    if (storedName) {
      setFullName(storedName)
    }
    if (storedEmail) {
      setUserEmail(storedEmail)
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
  }

  const primaryButtons = [
    { label: 'BUY BPC', icon: CreditCard, color: 'bg-yellow-500', path: '/buy-bpc' },
    { label: 'WATCH', icon: Play, color: 'bg-blue-500', path: '/watch' },
    { label: 'AIRTIME', icon: Phone, color: 'bg-green-500', path: '/airtime' },
    { label: 'DATA', icon: Radio, color: 'bg-gray-500', path: '/data' },
  ]

  const moreServices = [
    { label: 'SUPPORT', icon: Headphones, color: 'bg-cyan-500', path: '/support' },
    { label: 'GROUP', icon: Users, color: 'bg-purple-500', path: '/group' },
    { label: 'EARN', icon: DollarSign, color: 'bg-yellow-400', path: '/earn' },
    { label: 'DATA REVIEW', icon: TrendingUp, color: 'bg-pink-500', path: '/data-review' },
    { label: 'BETTING', icon: Dices, color: 'bg-indigo-600', path: '/betting' },
    { label: 'TV SUBSCRIPTION', icon: Tv, color: 'bg-red-500', path: '/tv-subscription' },
    { label: 'ELECTRICITY', icon: Lightbulb, color: 'bg-yellow-600', path: '/electricity' },
    { label: 'REFER AND EARN', icon: Share2, color: 'bg-emerald-500', path: '/refer-earn' },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      {/* Top Blue Header */}
      <header className="sticky top-0 z-50 bg-[#0000ff] text-white">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-blue-600 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">BLUEPAY</h1>
          <button className="relative p-2 hover:bg-blue-600 rounded-lg">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 max-w-2xl mx-auto">
        {activeTab === 'home' && (
          <>
            {/* User Greeting */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#0000ff] flex items-center justify-center text-white text-xl font-bold">
                  {fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Good Morning</p>
                  <h2 className="text-lg font-bold text-gray-900">{fullName}</h2>
                </div>
              </div>
              <button className="p-3 bg-[#0000ff] rounded-full text-white hover:opacity-90">
                <Bell className="w-5 h-5" />
              </button>
            </div>

            {/* Balance Card - Compact */}
            <div className="bg-[#0000ff] rounded-2xl p-5 text-white shadow-lg mb-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white/70 text-xs mb-1">Available Balance</p>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-2xl font-bold">
                      {showBalance ? 'NGN 250,000.00' : '••••••••'}
                    </h3>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-1 hover:bg-white/20 rounded-lg transition"
                    >
                      {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Daily Allocation */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs">Daily Allocation</p>
                      <p className="font-bold text-sm">NGN250,000.00</p>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5">
                      <div className="bg-white h-1.5 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/withdraw')}
                  className="px-4 py-2 bg-white text-[#0000ff] font-bold rounded-full text-sm hover:opacity-90 transition ml-3 whitespace-nowrap"
                >
                  Withdraw
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {primaryButtons.map((btn) => {
                const Icon = btn.icon
                return (
                  <button
                    key={btn.label}
                    onClick={() => router.push(btn.path)}
                    className={`${btn.color} rounded-xl p-3 flex flex-col items-center gap-1 hover:opacity-90 transition text-white shadow-md`}
                  >
                    <Icon className="w-5 h-5" />
                    <p className="text-xs font-bold text-center leading-tight">{btn.label}</p>
                  </button>
                )
              })}
            </div>

            {/* More Services */}
            <h3 className="text-sm font-bold text-gray-900 mb-3">More Services</h3>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {moreServices.map((btn) => {
                const Icon = btn.icon
                return (
                  <button
                    key={btn.label}
                    onClick={() => router.push(btn.path)}
                    className={`${btn.color} rounded-xl p-3 flex flex-col items-center gap-1 hover:opacity-90 transition text-white shadow-md`}
                  >
                    <Icon className="w-5 h-5" />
                    <p className="text-xs font-bold text-center leading-tight">{btn.label}</p>
                  </button>
                )
              })}
            </div>

            {/* Promotional Banner */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg mb-6 overflow-hidden relative h-40 flex flex-col justify-center">
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-1">BLUEPAY V26 Promo</h4>
                <p className="text-sm text-gray-300">Exclusive offers just for you!</p>
              </div>
            </div>

            {/* Transaction History */}
            <h3 className="text-sm font-bold text-gray-900 mb-3">Transaction History</h3>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm text-gray-900">BPC Purchase</p>
                  <p className="font-bold text-sm text-green-600">+₦5,000</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">BPC2026_PRO_V30_650</p>
                  <p className="text-xs text-gray-400">Today 2:34 PM</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm text-gray-900">Airtime Top-up</p>
                  <p className="font-bold text-sm text-red-600">-₦1,000</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">BPC2026_PRO_V30_650</p>
                  <p className="text-xs text-gray-400">Today 1:15 PM</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm text-gray-900">Data Purchase</p>
                  <p className="font-bold text-sm text-red-600">-₦2,500</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">BPC2026_PRO_V30_650</p>
                  <p className="text-xs text-gray-400">Yesterday 4:22 PM</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="w-20 h-20 bg-[#0000ff] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h2>
              <p className="text-gray-600 text-sm mb-4">{userEmail}</p>
              <button className="px-6 py-2 bg-[#0000ff] text-white rounded-xl hover:opacity-90 transition text-sm font-semibold">
                Edit Profile
              </button>
            </div>

            <button className="w-full bg-white rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 transition shadow-sm">
              <Settings className="w-5 h-5 text-[#0000ff]" />
              <span className="font-semibold text-gray-900">Security Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-white rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 transition text-red-600 shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-2xl mx-auto shadow-2xl">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
              activeTab === 'home' ? 'text-orange-500' : 'text-gray-600'
            }`}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors text-gray-600`}
          >
            <MessageCircle className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Social</span>
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className="flex-1 flex flex-col items-center justify-center py-3"
          >
            <div className="w-11 h-11 bg-[#0000ff] rounded-full flex items-center justify-center text-white">
              <Plus className="w-6 h-6" />
            </div>
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors text-gray-600`}
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Data</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
              activeTab === 'profile' ? 'text-purple-500' : 'text-gray-600'
            }`}
          >
            <UserCircle className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
