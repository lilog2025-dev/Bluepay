// lib/balance-store.ts

export const INITIAL_BALANCE = 0

export interface Transaction {
  id?: string
  title?: string
  amount: number
  type?: 'credit' | 'debit' | 'earning' | string
  date?: string
  status?: string
  [key: string]: unknown
}

export function getBalance(): number {
  if (typeof window === 'undefined') return INITIAL_BALANCE
  const saved = localStorage.getItem('user_balance')
  if (!saved) {
    localStorage.setItem('user_balance', INITIAL_BALANCE.toString())
    return INITIAL_BALANCE
  }
  return parseFloat(saved) || INITIAL_BALANCE
}

export function updateBalance(newBalance: number): number {
  if (typeof window === 'undefined') return newBalance
  
  localStorage.setItem('user_balance', newBalance.toString())
  window.dispatchEvent(new CustomEvent('balanceChange', { detail: { balance: newBalance } }))
  window.dispatchEvent(new Event('storage'))
  
  return newBalance
}

export function addEarnings(amount: number): number {
  const current = getBalance()
  const updated = current + amount
  return updateBalance(updated)
}

export function addBalance(amount: number): number {
  return addEarnings(amount)
}

export function deductBalance(amount: number): number {
  const current = getBalance()
  const updated = Math.max(0, current - amount)
  return updateBalance(updated)
}

export function addTransaction(tx: Transaction | unknown): void {
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem('user_transactions') || '[]')
    localStorage.setItem('user_transactions', JSON.stringify([tx, ...existing]))
    window.dispatchEvent(new CustomEvent('transactionAdded', { detail: tx }))
  }
}
