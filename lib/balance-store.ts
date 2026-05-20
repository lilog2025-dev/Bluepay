// Simple unified demo balance store using localStorage
const BALANCE_KEY = 'bluepay_demo_balance'
const TRANSACTIONS_KEY = 'bluepay_transactions'
const INITIAL_BALANCE = 250000

export interface Transaction {
  id: string
  type: 'withdrawal' | 'airtime' | 'data' | 'betting' | 'electricity' | 'tv' | 'reward'
  amount: number
  status: 'success' | 'pending' | 'failed'
  description: string
  timestamp: string
}

// Initialize balance if not exists
export function initializeBalance() {
  if (typeof window === 'undefined') return INITIAL_BALANCE
  const stored = localStorage.getItem(BALANCE_KEY)
  if (!stored) {
    localStorage.setItem(BALANCE_KEY, INITIAL_BALANCE.toString())
    return INITIAL_BALANCE
  }
  return parseFloat(stored)
}

// Get current balance
export function getBalance(): number {
  if (typeof window === 'undefined') return INITIAL_BALANCE
  const balance = localStorage.getItem(BALANCE_KEY)
  return balance ? parseFloat(balance) : INITIAL_BALANCE
}

// Update balance
export function setBalance(amount: number): number {
  if (typeof window === 'undefined') return INITIAL_BALANCE
  const newBalance = Math.max(0, amount)
  localStorage.setItem(BALANCE_KEY, newBalance.toString())
  // Trigger storage event for cross-tab updates
  window.dispatchEvent(new Event('balanceChange'))
  return newBalance
}

// Deduct amount from balance
export function deductBalance(amount: number): number {
  const currentBalance = getBalance()
  const newBalance = currentBalance - amount
  return setBalance(newBalance)
}

// Add amount to balance (for rewards)
export function addBalance(amount: number): number {
  const currentBalance = getBalance()
  const newBalance = currentBalance + amount
  return setBalance(newBalance)
}

// Add transaction
export function addTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
  if (typeof window === 'undefined') {
    return {
      ...transaction,
      id: '',
      timestamp: '',
    }
  }

  const stored = localStorage.getItem(TRANSACTIONS_KEY)
  const transactions: Transaction[] = stored ? JSON.parse(stored) : []

  const newTransaction: Transaction = {
    ...transaction,
    id: `tx_${Date.now()}`,
    timestamp: new Date().toISOString(),
  }

  transactions.unshift(newTransaction)
  // Keep only last 50 transactions
  if (transactions.length > 50) {
    transactions.pop()
  }

  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
  window.dispatchEvent(new Event('transactionsChange'))

  return newTransaction
}

// Get all transactions
export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(TRANSACTIONS_KEY)
  return stored ? JSON.parse(stored) : []
}

// Clear all data (for testing)
export function clearAll() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(BALANCE_KEY)
  localStorage.removeItem(TRANSACTIONS_KEY)
}
