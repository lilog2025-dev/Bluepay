// lib/balance-store.ts

export const INITIAL_BALANCE = 0

export interface Transaction {
  id?: string
  title?: string
  amount: number
  type?: string
  [key: string]: unknown
}

export function getBalance(): number {
  if (typeof window === 'undefined') return INITIAL_BALANCE
  
  // Checks all possible storage keys your dashboard might be using
  const keys = ['user_balance', 'user_available_balance', 'balance', 'wallet_balance', 'available_balance']
  for (const key of keys) {
    const val = localStorage.getItem(key)
    if (val !== null && !isNaN(parseFloat(val))) {
      return parseFloat(val)
    }
  }
  
  localStorage.setItem('user_balance', INITIAL_BALANCE.toString())
  return INITIAL_BALANCE
}

export function updateBalance(newBalance: number): number {
  if (typeof window === 'undefined') return newBalance
  
  // Updates every potential key simultaneously so they stay perfectly synced
  const keys = ['user_balance', 'user_available_balance', 'balance', 'wallet_balance', 'available_balance']
  keys.forEach(key => localStorage.setItem(key, newBalance.toString()))
  
  window.dispatchEvent(new CustomEvent('balanceChange', { detail: { balance: newBalance } }))
  window.dispatchEvent(new Event('storage'))
  
  return newBalance
}

export function addEarnings(amount: number): number {
  return updateBalance(getBalance() + amount)
}

export function addBalance(amount: number): number {
  return addEarnings(amount)
}

export function deductBalance(amount: number): number {
  return updateBalance(Math.max(0, getBalance() - amount))
}

export function addTransaction(tx: Transaction | unknown): void {
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem('user_transactions') || '[]')
    localStorage.setItem('user_transactions', JSON.stringify([tx, ...existing]))
    window.dispatchEvent(new CustomEvent('transactionAdded', { detail: tx }))
  }
}
