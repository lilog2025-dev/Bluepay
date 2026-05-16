import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(value)
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  const maskedLocal = local.slice(0, 2) + '*'.repeat(local.length - 2)
  return `${maskedLocal}@${domain}`
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  return password.length >= 8
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[0-9]{10,15}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) return `+234${cleaned}`
  if (cleaned.length === 11) return `+234${cleaned.slice(1)}`
  if (cleaned.startsWith('234')) return `+${cleaned}`
  return `+234${cleaned}`
}
