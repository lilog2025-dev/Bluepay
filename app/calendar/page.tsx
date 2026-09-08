'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

export default function CalendarPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 8)) // September 2026

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-8">
      <header className="sticky top-0 z-40 bg-[#181818] border-b border-[#242424]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-[#242424] rounded-lg text-white/80 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-white">Calendar</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="bg-[#181818] border border-[#242424] rounded-3xl p-5 shadow-2xl">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-[#242424] rounded-xl transition text-white/70 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-white tracking-wide">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-[#242424] rounded-xl transition text-white/70 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days of the Week */}
          <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-3 text-center text-xs">
            {Array.from({ length: firstDayIndex }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const isToday =
                day === 8 &&
                currentDate.getMonth() === 8 &&
                currentDate.getFullYear() === 2026

              return (
                <div key={day} className="flex justify-center">
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-2xl font-medium transition ${
                      isToday
                        ? 'bg-[#10B981] text-white font-bold shadow-lg shadow-[#10B981]/20'
                        : 'text-white/80 hover:bg-[#242424]'
                    }`}
                  >
                    {day}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
