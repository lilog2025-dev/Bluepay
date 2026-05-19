'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Check } from 'lucide-react'
import { sendDebitAlert, generateTransactionId, getCurrentDateTime } from '@/lib/debit-alert'
import { createClient } from '@supabase/supabase-js'

const TRANSACTION_CODE = 'BPC2026_PRO_V30_650'

export default function TVSubscriptionPage() {
  const router = useRouter()
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fullName, setFullName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const providers = [
    { id: 'dstv', name: 'DStv', plans: [
      { id: 'lite', name: 'Lite', price: 3900 },
      { id: 'compact', name: 'Compact', price: 9900 },
      { id: 'premium', name: 'Premium', price: 27500 },
    ]},
    { id: 'gotv', name: 'GoTV', plans: [
      { id: 'lite', name: 'Lite', price: 1500 },
      { id: 'max', name: 'Max', price: 3800 },
      { id: 'jinja', name: 'Jinja', price: 9100 },
    ]},
    { id: 'startimes', name: 'StarTimes', plans: [
      { id: 'basic', name: 'Basic', price: 1900 },
      { id: 'classic', name: 'Classic', price: 4500 },
      { id: 'premium', name: 'Premium', price: 9800 },
    ]},
  ]

  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUserEmail(session.user.email || '')
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single()
          if (profile?.full_name) setFullName(profile.full_name)
        }
      } catch (err) {
        setFullName(sessionStorage.getItem('signupFullName') || 'BLUEPAY User')
        setUserEmail(sessionStorage.getItem('signupEmail') || '')
      }
    }
    loadUserData()
  }, [])

  const currentProvider = providers.find(p => p.id === selectedProvider)
  const currentPlan = currentProvider?.plans.find(pl => pl.id === selectedPlan)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProvider || !selectedPlan) {
      alert('Please select a provider and plan')
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Send debit alert
      const transactionId = Date.now().toString()
      const { date, time } = formatDateTimeForEmail()
      
      await sendDebitAlert({
        fullName: fullName,
        email: userEmail,
        amount: currentPlan?.price || 0,
        transactionType: 'TV Subscription',
        transactionId: transactionId,
        date: date,
        time: time,
      })
      
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Activated!</h1>
          <p className="text-gray-600">Your TV subscription is now active</p>
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
          <h1 className="text-xl font-bold text-gray-900">TV Subscription</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Select TV Provider</label>
            <select
              value={selectedProvider}
              onChange={(e) => {
                setSelectedProvider(e.target.value)
                setSelectedPlan('')
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose provider</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>{provider.name}</option>
              ))}
            </select>
          </div>

          {selectedProvider && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Select Plan</label>
              <div className="space-y-2">
                {currentProvider?.plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full p-3 rounded-lg border-2 transition text-left ${
                      selectedPlan === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-900">{plan.name}</p>
                      <p className="font-bold text-gray-900">₦{plan.price.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentPlan && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Subscription Summary</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Provider</span>
                  <span className="font-bold text-gray-900">{currentProvider?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Plan</span>
                  <span className="font-bold text-gray-900">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                  <span className="text-gray-700 font-semibold">Total Amount</span>
                  <span className="font-bold text-blue-600">₦{currentPlan.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Transaction Code</p>
            <p className="text-lg font-bold text-gray-900">{TRANSACTION_CODE}</p>
          </div>

          <button
            type="submit"
            disabled={loading || !currentPlan}
            className="w-full bg-[#0000ff] text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 mt-8"
          >
            {loading ? 'Processing...' : 'Activate Subscription'}
          </button>
        </form>
      </div>
    </div>
  )
}
