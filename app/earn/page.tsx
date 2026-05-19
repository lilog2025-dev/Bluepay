'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Gift, Zap, Star, Trophy, Loader } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

export default function EarnMorePage() {
  const router = useRouter()
  const [claimedTasks, setClaimedTasks] = useState<number[]>([])
  const [claimingTaskId, setClaimingTaskId] = useState<number | null>(null)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [balance, setBalance] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [lastTaskRefresh, setLastTaskRefresh] = useState(0)
  const [nextRefreshTime, setNextRefreshTime] = useState(0)

  const tasks = [
    { id: 1, title: 'Share BPC to Friends', reward: 500, difficulty: 'Easy', icon: Gift },
    { id: 2, title: 'Complete Your Profile', reward: 1000, difficulty: 'Easy', icon: CheckCircle },
    { id: 3, title: 'Verify Your Identity', reward: 800, difficulty: 'Medium', icon: Zap },
    { id: 4, title: 'Make 5 Transactions', reward: 1000, difficulty: 'Medium', icon: Trophy },
    { id: 5, title: 'Invite a Friend', reward: 1000, difficulty: 'Easy', icon: Gift },
    { id: 6, title: 'Buy BPC Code', reward: 500, difficulty: 'Medium', icon: Gift },
    { id: 7, title: 'Set Up 2FA', reward: 600, difficulty: 'Easy', icon: Zap },
    { id: 8, title: 'Watch Tutorial Video', reward: 300, difficulty: 'Easy', icon: Star },
    { id: 9, title: 'Rate the App', reward: 400, difficulty: 'Easy', icon: Star },
    { id: 10, title: 'Daily Login Streak (7 days)', reward: 1000, difficulty: 'Medium', icon: Zap },
  ]

  useEffect(() => {
    setMounted(true)
    loadProfileData()
    setupRealtimeListeners()
  }, [])

  useEffect(() => {
    if (nextRefreshTime > 0) {
      const timer = setInterval(() => {
        const now = Date.now()
        if (now >= nextRefreshTime) {
          // Tasks have refreshed
          setClaimedTasks([])
          setLastTaskRefresh(now)
          setNextRefreshTime(now + 24 * 60 * 60 * 1000)
          showSuccessToast('New Tasks Available')
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [nextRefreshTime])

  const setupRealtimeListeners = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Subscribe to profile changes for realtime balance updates
        const subscription = supabase
          .channel(`profile-${session.user.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${session.user.id}` }, (payload) => {
            if (payload.new) {
              setBalance(payload.new.balance || 0)
              setTotalEarnings(payload.new.total_earned || 0)
            }
          })
          .subscribe()
        return () => subscription.unsubscribe()
      }
    } catch (err) {
      console.error('[v0] Error setting up realtime listeners:', err)
    }
  }

  const loadProfileData = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('balance, total_earned')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setBalance(profile.balance || 0)
          setTotalEarnings(profile.total_earned || 0)
        }

        // Load claimed tasks from localStorage (persisted after refresh)
        const today = new Date().toDateString()
        const storedData = localStorage.getItem('earn_tasks_data')
        if (storedData) {
          const { date, claimed, refresh } = JSON.parse(storedData)
          if (date === today) {
            setClaimedTasks(claimed || [])
            setLastTaskRefresh(refresh)
            setNextRefreshTime(refresh + 24 * 60 * 60 * 1000)
          } else {
            // New day - reset
            localStorage.setItem('earn_tasks_data', JSON.stringify({ date: today, claimed: [], refresh: Date.now() }))
            setClaimedTasks([])
            setLastTaskRefresh(Date.now())
            setNextRefreshTime(Date.now() + 24 * 60 * 60 * 1000)
          }
        } else {
          // First time
          const now = Date.now()
          localStorage.setItem('earn_tasks_data', JSON.stringify({ date: today, claimed: [], refresh: now }))
          setLastTaskRefresh(now)
          setNextRefreshTime(now + 24 * 60 * 60 * 1000)
        }
      }
    } catch (err) {
      console.error('[v0] Error loading profile:', err)
    }
  }

  const handleClaimReward = async (taskId: number) => {
    if (claimedTasks.includes(taskId) || claimingTaskId !== null) return

    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    setClaimingTaskId(taskId)

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Update balance in Supabase
        const newBalance = balance + task.reward
        const { error } = await supabase
          .from('profiles')
          .update({ balance: newBalance, total_earned: totalEarnings + task.reward })
          .eq('id', session.user.id)

        if (error) throw error

        // Update local state
        setBalance(newBalance)
        setTotalEarnings(totalEarnings + task.reward)
        setClaimedTasks([...claimedTasks, taskId])

        // Persist to localStorage
        const today = new Date().toDateString()
        const newClaimed = [...claimedTasks, taskId]
        localStorage.setItem('earn_tasks_data', JSON.stringify({ date: today, claimed: newClaimed, refresh: lastTaskRefresh }))

        showSuccessToast('Reward claimed successfully')
      }
    } catch (err) {
      console.error('[v0] Error claiming reward:', err)
      showSuccessToast('Failed to claim reward')
    } finally {
      setClaimingTaskId(null)
    }
  }

  const showSuccessToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const getTimeUntilRefresh = () => {
    if (nextRefreshTime === 0) return '24h 00m 00s'
    const diff = Math.max(0, nextRefreshTime - Date.now())
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-3 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#0000ff] hover:opacity-80 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-sm">Back</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Earn More</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-3 py-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-[#0000ff] to-blue-600 rounded-xl p-4 text-white mb-4">
          <p className="text-white/70 text-xs mb-1">Current Balance</p>
          <h2 className="text-2xl font-bold">NGN {balance.toLocaleString()}</h2>
          <p className="text-xs opacity-80 mt-1">Earned: ₦{totalEarnings.toLocaleString()}</p>
        </div>

        {/* Task Refresh Timer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs font-semibold text-gray-900 mb-1">Next Tasks Refresh In:</p>
          <p className="text-lg font-bold text-[#0000ff] font-mono">{getTimeUntilRefresh()}</p>
        </div>

        {/* Tasks Grid */}
        <h3 className="text-base font-bold text-gray-900 mb-3">Available Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {tasks.map((task) => {
            const Icon = task.icon
            const isClaimed = claimedTasks.includes(task.id)
            const isClaiming = claimingTaskId === task.id

            return (
              <div
                key={task.id}
                className={`rounded-lg p-3 border transition-all ${
                  isClaimed
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'border-gray-200 bg-white hover:border-[#0000ff]'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className={`p-2 rounded ${isClaimed ? 'bg-gray-200' : 'bg-[#0000ff]/10'}`}>
                    <Icon className={`w-4 h-4 ${isClaimed ? 'text-gray-400' : 'text-[#0000ff]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-xs mb-1 ${isClaimed ? 'text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h4>
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded inline-block ${
                        task.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-700'
                          : task.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {task.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#0000ff]">+₦{task.reward}</p>
                  <button
                    onClick={() => handleClaimReward(task.id)}
                    disabled={isClaimed || isClaiming}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition flex items-center gap-1 ${
                      isClaimed
                        ? 'bg-gray-200 text-gray-500'
                        : 'bg-[#0000ff] text-white hover:opacity-90'
                    }`}
                  >
                    {isClaiming ? (
                      <>
                        <Loader className="w-3 h-3 animate-spin" />
                        <span>Claiming...</span>
                      </>
                    ) : isClaimed ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        <span>Claimed</span>
                      </>
                    ) : (
                      'Claim'
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Box */}
        <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-gray-700">
            <span className="font-semibold">💡 Tip:</span> Complete tasks to earn rewards that are added directly to your BLUEPAY balance!
          </p>
        </div>
      </main>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold animate-bounce z-50">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
