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
import { createClient } from '@supabase/supabase-js'
import { getCurrentBalance, subscribeToBalance } from '@/lib/balance'

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')
  const [showBalance, setShowBalance] = useState(true)
  const [fullName, setFullName] = useState('User')
  const [userEmail, setUserEmail] = useState('')
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [balance, setBalance] = useState<number>(250000)
  const [userId, setUserId] = useState<string>('')
  const [loadingBalance, setLoadingBalance] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)

  useEffect(() => {
    setMounted(true)
    loadUserData()
  }, [])

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'airtime': return <Phone className="w-4 h-4" />
      case 'data': return <Radio className="w-4 h-4" />
      case 'electricity': return <Lightbulb className="w-4 h-4" />
      case 'tv': return <Tv className="w-4 h-4" />
      case 'betting': return <Dices className="w-4 h-4" />
      case 'withdrawal': return <DollarSign className="w-4 h-4" />
      default: return <CreditCard className="w-4 h-4" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch(type) {
      case 'airtime': return 'text-yellow-600 bg-yellow-50'
      case 'data': return 'text-cyan-600 bg-cyan-50'
      case 'electricity': return 'text-orange-600 bg-orange-50'
      case 'tv': return 'text-purple-600 bg-purple-50'
      case 'betting': return 'text-red-600 bg-red-50'
      case 'withdrawal': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-NG')
    }
  }

  const loadRecentTransactions = async (userId: string, supabase: any) => {
    try {
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (!txError && txData) {
        setTransactions(txData)
        console.log('[v0] Transactions loaded:', txData)
      }
    } catch (err) {
      console.error('[v0] Error loading transactions:', err)
    }
  }

  const loadUserData = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Get authenticated user
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUserId(session.user.id)
        setUserEmail(session.user.email || '')

        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single()

        if (profile?.full_name) {
          setFullName(profile.full_name)
        }

        // Load current balance - will auto-initialize wallet if needed
        const currentBalance = await getCurrentBalance(session.user.id)
        // Ensure balance is never less than 0, use value as-is otherwise
        const displayBalance = currentBalance >= 0 ? currentBalance : 250000
        setBalance(displayBalance)
        setLoadingBalance(false)

        // Subscribe to balance changes in realtime
        const unsubscribe = subscribeToBalance(session.user.id, (newBalance) => {
          const validBalance = newBalance >= 0 ? newBalance : 250000
          setBalance(validBalance)
          console.log('[v0] Dashboard balance updated:', validBalance)
        })

        // Load recent transactions
        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (!txError && txData) {
          setTransactions(txData)
        }
        setLoadingTransactions(false)

        // Subscribe to transaction changes in realtime
        const txChannel = supabase
          .channel(`transactions:${session.user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'transactions',
              filter: `user_id=eq.${session.user.id}`,
            },
            (payload) => {
              console.log('[v0] Transaction update:', payload)
              // Refetch transactions on any change
              loadRecentTransactions(session.user.id, supabase)
            }
          )
          .subscribe()

        // Cleanup subscription on unmount
        return () => {
          unsubscribe()
          supabase.removeChannel(txChannel)
        }
      } else {
        // Fallback to session storage if not authenticated
        const storedName = sessionStorage.getItem('signupFullName')
        const storedEmail = sessionStorage.getItem('signupEmail')
        if (storedName) {
          setFullName(storedName)
        }
        if (storedEmail) {
          setUserEmail(storedEmail)
        }
        setBalance(250000)
        setLoadingBalance(false)
        setLoadingTransactions(false)
      }
    } catch (err) {
      console.error('[v0] Error loading user data:', err)
      const storedName = sessionStorage.getItem('signupFullName')
      if (storedName) {
        setFullName(storedName)
      }
      setBalance(250000)
      setLoadingBalance(false)
      setLoadingTransactions(false)
    }
  }

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
    { label: 'DATA REVIEW', icon: TrendingUp, color: 'bg-pink-500', path: '/support' },
    { label: 'BETTING', icon: Dices, color: 'bg-indigo-600', path: '/betting' },
    { label: 'TV SUBSCRIPTION', icon: Tv, color: 'bg-red-500', path: '/tv-subscription' },
    { label: 'ELECTRICITY', icon: Lightbulb, color: 'bg-yellow-600', path: '/electricity' },
    { label: 'REFER AND EARN', icon: Share2, color: 'bg-emerald-500', path: '/refer-earn' },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* Top Blue Header - Compact */}
      <header className="sticky top-0 z-50 bg-[#0000ff] text-white">
        <div className="px-3 py-2 flex items-center justify-between">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 hover:bg-blue-600 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">BLUEPAY</h1>
          <button className="relative p-1 hover:bg-blue-600 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>
        </div>
      </header>

      {/* Main Content - Compact */}
      <main className="px-3 py-2 max-w-2xl mx-auto">
        {activeTab === 'home' && (
          <>
            {/* User Greeting - Reduced */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#0000ff] flex items-center justify-center text-white text-base font-bold">
                  {fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Good Morning</p>
                  <h2 className="text-base font-bold text-gray-900">{fullName}</h2>
                </div>
              </div>
              <button className="p-2 bg-[#0000ff] rounded-full text-white hover:opacity-90">
                <Bell className="w-4 h-4" />
              </button>
            </div>

            {/* Balance Card - Compact */}
            <div className="bg-[#0000ff] rounded-xl p-2.5 text-white shadow-lg mb-3">
              <p className="text-white/70 text-xs mb-1">Available Balance</p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 flex-1">
                  <h3 className="text-base font-bold">
                    {loadingBalance ? 'Loading...' : (showBalance ? `NGN ${balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.00` : '••••••••')}
                  </h3>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-0.5 hover:bg-white/20 rounded-lg transition"
                  >
                    {showBalance ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                </div>
                <button
                  onClick={() => router.push('/withdraw')}
                  className="px-2 py-0.5 bg-white text-[#0000ff] font-bold rounded-full text-xs hover:opacity-90 transition whitespace-nowrap"
                >
                  Withdraw
                </button>
              </div>
              
              {/* Daily Allocation - Compact */}
              <div className="mt-1.5 pt-1.5 border-t border-white/20">
                <div className="flex justify-between items-center text-xs mb-0.5">
                  <p className="text-white/80">Daily Allocation</p>
                  <p className="font-bold text-white">NGN{balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.00</p>
                </div>
                <div className="w-full bg-white/20 rounded-full h-0.5">
                  <div className="bg-white h-0.5 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
            </div>

            {/* Primary Action Buttons - Compact */}
            <div className="grid grid-cols-4 gap-1 mb-3">
              {primaryButtons.map((btn) => {
                const Icon = btn.icon
                return (
                  <button
                    key={btn.label}
                    onClick={() => router.push(btn.path)}
                    className={`${btn.color} rounded-lg p-2 flex flex-col items-center gap-0.5 hover:opacity-90 transition text-white shadow-sm`}
                  >
                    <Icon className="w-4 h-4" />
                    <p className="text-xs font-bold text-center leading-tight">{btn.label}</p>
                  </button>
                )
              })}
            </div>

            {/* More Services */}
            <h3 className="text-xs font-bold text-gray-900 mb-2">More Services</h3>
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              {moreServices.map((btn) => {
                const Icon = btn.icon
                return (
                  <button
                    key={btn.label}
                    onClick={() => router.push(btn.path)}
                    className={`${btn.color} rounded-lg p-2 flex flex-col items-center gap-0.5 hover:opacity-90 transition text-white shadow-sm`}
                  >
                    <Icon className="w-4 h-4" />
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
            <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Transactions</h3>
            <div className="space-y-2">
              {loadingTransactions ? (
                <p className="text-xs text-gray-600 text-center py-4">Loading transactions...</p>
              ) : transactions.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-4">No transactions yet</p>
              ) : (
                transactions.map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${getTransactionColor(tx.type)}`}>
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{tx.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-red-600">-₦{Math.abs(tx.amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <p className="text-xs text-gray-500 capitalize">{tx.status}</p>
                    </div>
                  </div>
                ))
              )}
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
          {/* Calendar */}
          <button
            onClick={() => router.push('/calendar')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors text-gray-600 hover:text-orange-500`}
          >
            <Calendar className="w-5 h-5 mb-1 text-orange-500" />
            <span className="text-xs font-medium">Calendar</span>
          </button>
          
          {/* Social */}
          <button
            onClick={() => router.push('/social')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors text-gray-600 hover:text-pink-500`}
          >
            <MessageCircle className="w-5 h-5 mb-1 text-pink-500" />
            <span className="text-xs font-medium">Social</span>
          </button>
          
          {/* Center Plus */}
          <button
            onClick={() => router.push('/quick-actions')}
            className="flex-1 flex flex-col items-center justify-center py-3 hover:scale-110 transition"
          >
            <div className="w-11 h-11 bg-[#0000ff] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl">
              <Plus className="w-6 h-6" />
            </div>
          </button>
          
          {/* Support */}
          <button
            onClick={() => router.push('/support')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors text-gray-600 hover:text-cyan-500`}
          >
            <BarChart3 className="w-5 h-5 mb-1 text-cyan-500" />
            <span className="text-xs font-medium">Support</span>
          </button>
          
          {/* Profile */}
          <button
            onClick={() => router.push('/profile')}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors text-gray-600 hover:text-purple-600`}
          >
            <UserCircle className="w-5 h-5 mb-1 text-purple-600" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
