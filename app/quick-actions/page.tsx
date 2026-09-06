'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, Phone, Zap, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react'

export default function QuickActionsPage() {
  const router = useRouter()

  const actions = [
    { icon: Send, label: 'Quick Transfer', route: '/withdraw', color: 'bg-blue-50 text-blue-600' },
    { icon: Phone, label: 'Airtime', route: '/airtime', color: 'bg-green-50 text-green-600' },
    { icon: Zap, label: 'Data', route: '/data', color: 'bg-purple-50 text-purple-600' },
    { icon: DollarSign, label: 'Bill Payment', route: '/electricity', color: 'bg-orange-50 text-orange-600' },
    { icon: TrendingUp, label: 'Betting', route: '/betting', color: 'bg-red-50 text-red-600' },
    { icon: ShoppingCart, label: 'Buy PayFlexCode', route: '/buy-PayFlexCode', color: 'bg-indigo-50 text-indigo-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-2 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Quick Actions</h1>
          <div className="w-5" />
        </div>
      </header>

      <main className="px-3 py-4 max-w-2xl mx-auto">
        <p className="text-xs text-gray-600 mb-4 text-center">
          Access your most used services quickly
        </p>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, idx) => {
            const Icon = action.icon
            return (
              <button
                key={idx}
                onClick={() => router.push(action.route)}
                className={`${action.color} rounded-lg p-4 flex flex-col items-center justify-center hover:opacity-90 transition`}
              >
                <Icon className="w-8 h-8 mb-2" />
                <p className="text-xs font-semibold text-center">{action.label}</p>
              </button>
            )
          })}
        </div>

        {/* Recent Transactions Shortcut */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50 transition">
              <p className="font-semibold text-gray-900 text-sm">Airtime - ₦1,000</p>
              <p className="text-xs text-gray-600">Today at 2:34 PM</p>
            </button>
            <button className="w-full bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50 transition">
              <p className="font-semibold text-gray-900 text-sm">Data Bundle - ₦500</p>
              <p className="text-xs text-gray-600">Yesterday at 1:15 PM</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
