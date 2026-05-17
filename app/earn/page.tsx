'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Gift, Zap, Star, Trophy } from 'lucide-react'

export default function EarnMorePage() {
  const router = useRouter()
  const [completedTasks, setCompletedTasks] = useState<number[]>([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const tasks = [
    { id: 1, title: 'Share BPC to Friends', reward: 500, difficulty: 'Easy', icon: Gift },
    { id: 2, title: 'Complete Your Profile', reward: 1000, difficulty: 'Easy', icon: CheckCircle },
    { id: 3, title: 'Verify Your Identity', reward: 2000, difficulty: 'Medium', icon: Zap },
    { id: 4, title: 'Make 5 Transactions', reward: 1500, difficulty: 'Medium', icon: Trophy },
    { id: 5, title: 'Invite a Friend', reward: 3000, difficulty: 'Easy', icon: Gift },
    { id: 6, title: 'Spend ₦10,000', reward: 2500, difficulty: 'Medium', icon: Zap },
    { id: 7, title: 'Connect Bank Account', reward: 2000, difficulty: 'Medium', icon: CheckCircle },
    { id: 8, title: 'Set Up 2FA', reward: 1500, difficulty: 'Easy', icon: Zap },
    { id: 9, title: 'Watch Tutorial Video', reward: 500, difficulty: 'Easy', icon: Star },
    { id: 10, title: 'Rate the App', reward: 1000, difficulty: 'Easy', icon: Star },
    { id: 11, title: 'Buy BPC Code', reward: 2000, difficulty: 'Medium', icon: Gift },
    { id: 12, title: 'Refer 3 Friends', reward: 5000, difficulty: 'Hard', icon: Trophy },
    { id: 13, title: 'Complete Quiz', reward: 800, difficulty: 'Easy', icon: Star },
    { id: 14, title: 'Daily Login Streak (7 days)', reward: 3000, difficulty: 'Medium', icon: Zap },
    { id: 15, title: 'Transfer ₦5,000', reward: 1200, difficulty: 'Medium', icon: CheckCircle },
    { id: 16, title: 'Use BLUEPAY 10 Times', reward: 2000, difficulty: 'Medium', icon: Trophy },
    { id: 17, title: 'Share on Social Media', reward: 600, difficulty: 'Easy', icon: Gift },
    { id: 18, title: 'Download Referral Code', reward: 500, difficulty: 'Easy', icon: CheckCircle },
    { id: 19, title: 'Enable Notifications', reward: 300, difficulty: 'Easy', icon: Zap },
    { id: 20, title: 'Complete Security Quiz', reward: 1500, difficulty: 'Medium', icon: Star },
  ]

  const handleCompleteTask = (taskId: number) => {
    if (!completedTasks.includes(taskId)) {
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        setCompletedTasks([...completedTasks, taskId])
        setTotalEarnings(totalEarnings + task.reward)
      }
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#0000ff] hover:opacity-80 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Earn More</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Earnings Summary */}
        <div className="bg-gradient-to-r from-[#0000ff] to-blue-600 rounded-3xl p-6 text-white shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm mb-1">Total Earnings</p>
              <h2 className="text-4xl font-bold">₦{totalEarnings.toLocaleString()}</h2>
            </div>
            <Trophy className="w-16 h-16 text-yellow-300 opacity-80" />
          </div>
          <div className="flex justify-between text-sm">
            <p>Tasks Completed: {completedTasks.length}/{tasks.length}</p>
            <p>Potential Earnings: ₦{tasks.reduce((sum, t) => sum + t.reward, 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Tasks Grid */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">Available Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => {
            const Icon = task.icon
            const isCompleted = completedTasks.includes(task.id)

            return (
              <div
                key={task.id}
                className={`rounded-2xl p-5 border-2 transition-all ${
                  isCompleted
                    ? 'bg-gray-50 border-gray-200 opacity-70'
                    : 'border-gray-200 hover:border-[#0000ff] hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-3 rounded-lg ${isCompleted ? 'bg-gray-200' : 'bg-[#0000ff]/10'}`}>
                      <Icon className={`w-5 h-5 ${isCompleted ? 'text-gray-400' : 'text-[#0000ff]'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-sm mb-1 ${isCompleted ? 'text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </h4>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
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
                  {isCompleted && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-[#0000ff]">₦{task.reward.toLocaleString()}</p>
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={isCompleted}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      isCompleted
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0000ff] text-white hover:opacity-90'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'Complete'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Withdraw Earnings */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
          <h3 className="font-bold text-gray-900 mb-3">Ready to Withdraw?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Your earnings are automatically added to your BLUEPAY balance. Complete more tasks to increase your balance!
          </p>
          <button
            onClick={() => router.push('/withdraw')}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
          >
            Withdraw Earnings
          </button>
        </div>
      </main>
    </div>
  )
}
