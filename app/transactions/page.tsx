'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Filter,
  ChevronDown,
  Phone,
  Radio,
  Send,
  Lightbulb,
  Tv,
  Dices,
  CreditCard,
  TrendingUp,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'airtime' | 'data' | 'electricity' | 'tv' | 'betting' | 'withdraw' | 'deposit'
  description: string
  amount: number
  status: 'success' | 'pending' | 'failed'
  date: string
  time: string
  icon: React.ElementType
  color: string
  reference: string
}

export default function TransactionsPage() {
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const [showFilter, setShowFilter] = useState(false)
  const [copied, setCopied] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Sample transactions - in a real app, these would come from an API/database
  const allTransactions: Transaction[] = [
    {
      id: '1',
      type: 'withdraw',
      description: 'Withdrawal to Access Bank',
      amount: -5000,
      status: 'success',
      date: 'Today',
      time: '2:30 PM',
      icon: Send,
      color: 'text-blue-600',
      reference: 'TX20250517001',
    },
    {
      id: '2',
      type: 'data',
      description: 'MTN Data - 2GB',
      amount: -900,
      status: 'success',
      date: 'Today',
      time: '1:15 PM',
      icon: Radio,
      color: 'text-cyan-600',
      reference: 'TX20250517002',
    },
    {
      id: '3',
      type: 'airtime',
      description: 'Airtel Airtime - ₦1,000',
      amount: -1000,
      status: 'success',
      date: 'Today',
      time: '12:45 PM',
      icon: Phone,
      color: 'text-orange-600',
      reference: 'TX20250517003',
    },
    {
      id: '4',
      type: 'electricity',
      description: 'EKEDC Token Payment',
      amount: -10000,
      status: 'success',
      date: 'Yesterday',
      time: '5:30 PM',
      icon: Lightbulb,
      color: 'text-yellow-600',
      reference: 'TX20250516001',
    },
    {
      id: '5',
      type: 'tv',
      description: 'DStv Premium Renewal',
      amount: -19500,
      status: 'success',
      date: 'Yesterday',
      time: '3:00 PM',
      icon: Tv,
      color: 'text-teal-600',
      reference: 'TX20250516002',
    },
    {
      id: '6',
      type: 'betting',
      description: 'Bet365 Deposit + Bonus',
      amount: -5000,
      status: 'success',
      date: '2 days ago',
      time: '10:20 AM',
      icon: Dices,
      color: 'text-indigo-600',
      reference: 'TX20250515001',
    },
    {
      id: '7',
      type: 'deposit',
      description: 'Welcome Bonus Credit',
      amount: 5000,
      status: 'success',
      date: '3 days ago',
      time: '8:00 AM',
      icon: TrendingUp,
      color: 'text-green-600',
      reference: 'WB20250514001',
    },
    {
      id: '8',
      type: 'airtime',
      description: 'MTN Airtime - ₦2,000',
      amount: -2000,
      status: 'pending',
      date: '4 days ago',
      time: '4:15 PM',
      icon: Phone,
      color: 'text-orange-600',
      reference: 'TX20250513001',
    },
    {
      id: '9',
      type: 'data',
      description: 'Glo Data - 1GB',
      amount: -500,
      status: 'success',
      date: '5 days ago',
      time: '2:45 PM',
      icon: Radio,
      color: 'text-cyan-600',
      reference: 'TX20250512001',
    },
    {
      id: '10',
      type: 'withdraw',
      description: 'Withdrawal Failed',
      amount: -2500,
      status: 'failed',
      date: '6 days ago',
      time: '11:30 AM',
      icon: Send,
      color: 'text-red-600',
      reference: 'TX20250511001',
    },
  ]

  const transactions = filter === 'all' 
    ? allTransactions 
    : allTransactions.filter((t) => t.type === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700'
      case 'pending':
        return 'bg-amber-50 border-amber-200 text-amber-700'
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-700'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return CheckCircle
      case 'pending':
        return Clock
      case 'failed':
        return AlertCircle
      default:
        return Clock
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  const totalSpent = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const filters = [
    { value: 'all', label: 'All Transactions' },
    { value: 'airtime', label: 'Airtime' },
    { value: 'data', label: 'Data' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'tv', label: 'TV' },
    { value: 'betting', label: 'Betting' },
    { value: 'withdraw', label: 'Withdrawals' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Transactions</h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Download className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Summary Card */}
        <div className="bg-[#0000ff] rounded-2xl p-6 text-white mb-6 shadow-md">
          <p className="text-white/70 text-sm mb-2">Total Spent This Month</p>
          <h2 className="text-3xl font-bold mb-4">₦{totalSpent.toLocaleString()}</h2>
          <p className="text-xs text-white/60">
            {transactions.length} transactions
          </p>
        </div>

        {/* Filter Button */}
        <div className="relative mb-6">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">
                {filters.find((f) => f.value === filter)?.label || 'All Transactions'}
              </span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition ${
                showFilter ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Filter Dropdown */}
          {showFilter && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => {
                    setFilter(f.value)
                    setShowFilter(false)
                  }}
                  className={`w-full px-4 py-3 text-left font-semibold transition ${
                    filter === f.value
                      ? 'bg-blue-50 text-[#0000ff] border-l-4 border-[#0000ff]'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map((transaction) => {
              const Icon = transaction.icon
              const StatusIcon = getStatusIcon(transaction.status)
              return (
                <div key={transaction.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Main Transaction Item */}
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === transaction.id ? null : transaction.id)
                    }
                    className="w-full px-4 py-4 flex items-start justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start gap-3 flex-1 text-left">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className={`w-6 h-6 ${transaction.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {transaction.date} at {transaction.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <p
                        className={`font-bold text-lg ${
                          transaction.amount > 0
                            ? 'text-green-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}₦
                        {Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <StatusIcon className={`w-4 h-4 mt-1 ml-auto ${
                        transaction.status === 'success'
                          ? 'text-green-600'
                          : transaction.status === 'pending'
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`} />
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expandedId === transaction.id && (
                    <div className={`border-t border-gray-200 px-4 py-4 space-y-3 ${getStatusColor(transaction.status)}`}>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-semibold">Status</span>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-sm font-semibold capitalize">
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                      <div className="h-px bg-current opacity-20" />
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-semibold">Reference</span>
                        <button
                          onClick={() =>
                            copyToClipboard(transaction.reference, transaction.id)
                          }
                          className="flex items-center gap-2 font-mono text-sm hover:opacity-70"
                        >
                          {transaction.reference}
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      {copied === transaction.id && (
                        <p className="text-xs font-semibold opacity-70">
                          Copied to clipboard
                        </p>
                      )}
                      {transaction.status === 'pending' && (
                        <div className="mt-3 pt-3 border-t border-current opacity-20">
                          <p className="text-xs font-semibold opacity-70">
                            This transaction is being processed. You'll be notified once it completes.
                          </p>
                        </div>
                      )}
                      {transaction.status === 'failed' && (
                        <div className="mt-3 pt-3 border-t border-current opacity-20">
                          <p className="text-xs font-semibold opacity-70">
                            This transaction failed. Please try again or contact support.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <p className="text-gray-600 text-sm">
                No transactions found for this filter
              </p>
            </div>
          )}
        </div>

        {/* Load More */}
        {transactions.length > 0 && (
          <button className="w-full mt-6 py-3 px-4 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition">
            Load More Transactions
          </button>
        )}
      </main>
    </div>
  )
}
