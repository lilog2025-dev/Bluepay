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
  BarChart3,
  Calendar,
  MessageCircle,
  Plus,
  UserCircle,
  Settings,
  LogOut,
  MessageCircle as WhatsAppIcon,
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')
  const [showBalance, setShowBalance] = useState(true)
  const [fullName, setFullName] = useState('User')
  const [userEmail, setUserEmail] = useState('')
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

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

  useEffect(() => {
    const adInterval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % 1)
    }, 5000)
    return () => clearInterval(adInterval)
  }, [])

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
  }

  const transactions = [
    '* John Doe withdraw NGN86,131.25',
    '* Oluwaseun Adeyemi withdraw NGN1,50,000.00',
    '* Grace Nwanwa withdraw NGN25,000.50',
  ]

  const primaryButtons = [
    { label: 'BUY BPC', icon: CreditCard, color: 'bg-yellow-500', path: '/buy-bpc' },
    { label: 'WATCH', icon: Play, color: 'bg-blue-500', path: '/watch' },
    { label: 'AIRTIME', icon: Phone, color: 'bg-green-500', path: '/airtime' },
    { label: 'DATA', icon: Radio, color: 'bg-gray-500', path: '/data' },
  ]

  const moreServices = [
    { label: 'SUPPORT', icon: Headphones, color: 'bg-cyan-500', path: '/support' },
    { label: 'GROUP', icon: Users, color: 'bg-purple-500', path: '/group' },
    { label: 'EARN', icon: DollarSign, color: 'bg-yellow-500', path: '/earn' },
    { label: 'DATA REVIEW', icon: BarChart3, color: 'bg-pink-500', path: '/data-review' },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-32 relative">
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/+2347078434086?text=Hello%20Grace%2C%20I%20need%20support"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-36 right-6 z-40 group animate-bounce"
      >
        <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-semibold text-gray-800">
          Chat with Grace
        </div>
      </a>

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

        {/* Transaction Marquee */}
        <div className="bg-blue-600 overflow-hidden py-2 px-2">
          <div className="whitespace-nowrap animate-scroll text-sm text-white/90">
            {transactions.map((tx, i) => (
              <span key={i} className="inline-block mr-12">
                {tx}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* User Greeting Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#0000ff] flex items-center justify-center text-white text-2xl font-bold">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-gray-400 text-sm">Good Morning</p>
              <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
            </div>
          </div>
          <button className="p-3 bg-[#0000ff] rounded-full text-white hover:opacity-90 transition">
            <Bell className="w-6 h-6" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-[#0000ff] rounded-3xl p-6 text-white shadow-lg mb-8">
          <div className="mb-6">
            <p className="text-blue-200 text-sm mb-2">Available Balance</p>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-4xl font-bold">NGN 250,000.00</h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-white/20 rounded-xl transition"
              >
                {showBalance ? (
                  <Eye className="w-6 h-6" />
                ) : (
                  <EyeOff className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Daily Spend Target */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-blue-200 text-sm">Daily spend target</p>
                <p className="font-bold text-white">NGN200,000</p>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all"
                  style={{ width: '45%' }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/withdraw')}
            className="px-8 py-2 bg-white text-[#0000ff] font-bold rounded-full hover:opacity-90 transition"
          >
            Withdraw
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {primaryButtons.map((btn) => {
            const Icon = btn.icon
            return (
              <button
                key={btn.label}
                onClick={() => router.push(btn.path)}
                className={`${btn.color} rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-90 transition text-white shadow-md active:scale-95`}
              >
                <Icon className="w-6 h-6" />
                <p className="text-xs font-bold text-center leading-tight">{btn.label}</p>
              </button>
            )
          })}
        </div>

        {/* More Services Section */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">More Services</h3>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {moreServices.map((btn) => {
            const Icon = btn.icon
            return (
              <button
                key={btn.label}
                onClick={() => router.push(btn.path)}
                className={`${btn.color} rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-90 transition text-white shadow-md active:scale-95`}
              >
                <Icon className="w-6 h-6" />
                <p className="text-xs font-bold text-center leading-tight">{btn.label}</p>
              </button>
            )
          })}
        </div>

        {/* Advertisement Carousel */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden h-48 flex flex-col justify-between p-6 text-white shadow-lg relative">
          <div>
            <h3 className="text-lg font-bold">BLUEPAY V26 Promo</h3>
            <p className="text-sm text-gray-300">Exclusive offers just for you!</p>
          </div>
          {/* Carousel Dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentAdIndex ? 'bg-white w-6' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-end" onClick={() => setActiveTab('home')}>
          <div
            className="w-full bg-white rounded-t-3xl p-6 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[#0000ff] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h2>
              <p className="text-gray-600 text-sm">{userEmail}</p>
            </div>
            <button className="w-full bg-[#0000ff] text-white rounded-xl py-3 font-bold mb-4 hover:opacity-90">
              Edit Profile
            </button>
            <button className="w-full bg-gray-100 text-gray-900 rounded-xl py-3 font-bold flex items-center justify-center gap-2 mb-4 hover:bg-gray-200">
              <Settings className="w-5 h-5" />
              Security Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 rounded-xl py-3 font-bold flex items-center justify-center gap-2 hover:bg-red-100"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-2xl mx-auto shadow-2xl">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'home' ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            <Calendar className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'social' ? 'text-pink-500' : 'text-gray-400'
            }`}
          >
            <MessageCircle className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Social</span>
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className="flex-1 flex flex-col items-center justify-center py-4"
          >
            <div className="w-12 h-12 bg-[#0000ff] rounded-full flex items-center justify-center text-white">
              <Plus className="w-6 h-6" />
            </div>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'data' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <BarChart3 className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Data</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'profile' ? 'text-purple-500' : 'text-gray-400'
            }`}
          >
            <UserCircle className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
