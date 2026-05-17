'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Check } from 'lucide-react'

const TRANSACTION_CODE = 'BPC2026_PRO_V30_650'

export default function ElectricityPage() {
  const router = useRouter()
  const [disco, setDisco] = useState('')
  const [meterNumber, setMeterNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const discos = [
    'EKEDC', 'IKEDC', 'LEKKI EKO ELECTRICITY', 'AEDC',
    'BENIN ELECTRICITY', 'KANO ELECTRIC', 'KADUNA ELECTRIC', 'ABUJA ELECTRICITY'
  ]

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!disco || !meterNumber || !amount) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (error) {
      alert('Transaction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your electricity bill has been paid</p>
          <p className="text-sm text-gray-500 mt-2">Transaction: {TRANSACTION_CODE}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Pay Electricity Bill</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Select Electricity Provider</label>
            <select
              value={disco}
              onChange={(e) => setDisco(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose provider</option>
              {discos.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Meter Number</label>
            <input
              type="text"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              placeholder="Enter your meter number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Amount to Pay (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="500"
            />
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Transaction Code</p>
            <p className="text-lg font-bold text-gray-900">{TRANSACTION_CODE}</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0000ff] text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 mt-8"
          >
            {loading ? 'Processing...' : 'Pay Bill'}
          </button>
        </form>
      </div>
    </div>
  )
}
