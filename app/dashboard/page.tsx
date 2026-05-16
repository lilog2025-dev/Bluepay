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
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')
  const [showBalance, setShowBalance] = useState(true)
  const [userName, setUserName] = useState('User')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedName = sessionStorage.getItem('signupName')
    if (storedName) {
      const firstName = storedName.split(' ')[0]
      setUserName(firstName)
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back</p>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Hello {userName}
            </h1>
          </div>
          <button className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <>
            {/* Wallet Balance Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg mb-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-blue-100 text-sm mb-2">Total Balance</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold">
                      {showBalance ? '₦125,450.50' : '••••••'}
                    </h2>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-2 hover:bg-blue-500 rounded-lg transition"
                    >
                      {showBalance ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>
              <div className="flex justify-between text-sm text-blue-100">
                <div>
                  <p>Card Number</p>
                  <p className="font-semibold">•••• •••• •••• 4829</p>
                </div>
                <div>
                  <p>Valid Thru</p>
                  <p className="font-semibold">12/26</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button className="bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md dark:hover:bg-slate-700 transition shadow">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Send className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Transfer
                  </p>
                </button>
                <button className="bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md dark:hover:bg-slate-700 transition shadow">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Buy Airtime
                  </p>
                </button>
                <button className="bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md dark:hover:bg-slate-700 transition shadow">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Radio className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Buy Data
                  </p>
                </button>
                <button className="bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md dark:hover:bg-slate-700 transition shadow">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Pay Bills
                  </p>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md dark:hover:bg-slate-700 transition shadow">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Gift className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Rewards
                  </p>
                </button>
                <button className="bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md dark:hover:bg-slate-700 transition shadow">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Referrals
                  </p>
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recent Activities
              </h3>
              <div className="space-y-3">
                {[
                  {
                    type: 'Airtime Purchase',
                    amount: '-₦1,000',
                    time: '2 hours ago',
                    icon: ShoppingCart,
                  },
                  {
                    type: 'Transfer Received',
                    amount: '+₦5,000',
                    time: '5 hours ago',
                    icon: Send,
                  },
                  {
                    type: 'Bill Payment',
                    amount: '-₦2,500',
                    time: '1 day ago',
                    icon: Zap,
                  },
                ].map((transaction, index) => {
                  const Icon = transaction.icon
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between hover:shadow-md dark:hover:bg-slate-700 transition shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {transaction.type}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.time}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white">
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
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Wallet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Coming soon</p>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Transactions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Coming soon</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {userName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {userName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {sessionStorage.getItem('signupEmail') || 'user@example.com'}
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                Edit Profile
              </button>
            </div>

            <button className="w-full bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center gap-3 hover:shadow-md dark:hover:bg-slate-700 transition shadow">
              <Settings className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900 dark:text-white">
                Security Settings
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center gap-3 hover:shadow-md dark:hover:bg-slate-700 transition shadow text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 max-w-md mx-auto">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'home'
                ? 'text-blue-600 border-t-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'wallet'
                ? 'text-blue-600 border-t-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Wallet className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Wallet</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'transactions'
                ? 'text-blue-600 border-t-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">History</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
              activeTab === 'profile'
                ? 'text-blue-600 border-t-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
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
