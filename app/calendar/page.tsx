'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight, Bell } from 'lucide-react'

export default function CalendarPage() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4))

  const reminders = [
    { id: 1, title: 'Electricity Bill Due', date: '19th', time: 'Today' },
    { id: 2, title: 'Monthly Subscription', date: '25th', time: 'In 6 days' },
    { id: 3, title: 'Investment Review', date: 'Every Sunday', time: 'Recurring' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-2 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Calendar & Reminders</h1>
          <div className="w-5" />
        </div>
      </header>

      <main className="px-3 py-3 max-w-2xl mx-auto">
        {/* Calendar Header */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1">
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>
            <h2 className="font-bold text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1">
              <ChevronRight className="w-5 h-5 text-gray-900" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center rounded text-xs font-semibold ${
                  i === 18 ? 'bg-[#0000ff] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i < 6 ? 26 + i : i < 25 ? i - 5 : i - 24}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Reminders */}
        <h3 className="font-bold text-gray-900 text-sm mb-3">Upcoming Reminders</h3>
        <div className="space-y-2">
          {reminders.map(reminder => (
            <div key={reminder.id} className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0000ff]/10 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-[#0000ff]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{reminder.title}</p>
                <p className="text-xs text-gray-600">{reminder.time}</p>
              </div>
              <p className="text-xs font-bold text-gray-600 flex-shrink-0">{reminder.date}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
