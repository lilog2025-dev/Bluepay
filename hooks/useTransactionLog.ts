import { useCallback } from 'react'

interface TransactionLogParams {
  userEmail: string
  fullName: string
  amount: number | string
  type: 'withdraw' | 'betting' | 'tv_subscription' | 'electricity' | 'airtime' | 'data'
  description: string
}

export function useTransactionLog() {
  const logTransaction = useCallback(async (params: TransactionLogParams) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        console.error('Failed to log transaction')
        return false
      }

      const data = await response.json()
      console.log('Transaction logged:', data)
      return true
    } catch (error) {
      console.error('Error logging transaction:', error)
      return false
    }
  }, [])

  const getTransactionHistory = useCallback(async (email: string) => {
    try {
      const response = await fetch(`/api/transactions?email=${encodeURIComponent(email)}`)

      if (!response.ok) {
        return []
      }

      const data = await response.json()
      return data.transactions || []
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return []
    }
  }, [])

  return { logTransaction, getTransactionHistory }
}
