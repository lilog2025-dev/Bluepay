// lib/balance-store.ts

export const INITIAL_BALANCE = 250000

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
  
  // Store updated balance
  localStorage.setItem('user_balance', newBalance.toString())
  
  // Broadcast event across all components in current window
  window.dispatchEvent(new CustomEvent('balanceChange', { detail: { balance: newBalance } }))
  
  return newBalance
}

export function addEarnings(amount: number): number {
  const current = getBalance()
  const updated = current + amount
  return updateBalance(updated)
}

// Helper aliases to resolve Next.js build errors across page routes
export function addBalance(amount: number): number {
  return addEarnings(amount)
}

export function deductBalance(amount: number): number {
  const current = getBalance()
  const updated = current - amount
  return updateBalance(updated)
}

export function addTransaction(tx: any): void {
  // Dispatches transaction events or safely handles transaction history logging
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('transactionAdded', { detail: tx }))
  }
}
