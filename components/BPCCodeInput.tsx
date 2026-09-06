'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const CORRECT_PayFlexCode_CODE = 'PayFlexCode2026_PRO_V30_650'

interface PayFlexCodeCodeInputProps {
  onValidation: (isValid: boolean) => void
  onCodeChange?: (code: string) => void
}

export function PayFlexCodeCodeInput({ onValidation, onCodeChange }: PayFlexCodeCodeInputProps) {
  const [PayFlexCodeCode, setPayFlexCodeCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [error, setError] = useState('')

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPayFlexCodeCode(value)
    setError('')
    onCodeChange?.(value)

    // Validate on change
    if (value.length === CORRECT_PayFlexCode_CODE.length) {
      if (value === CORRECT_PayFlexCode_CODE) {
        onValidation(true)
      } else {
        setError('Wrong Bank Processing Code (PayFlexCode CODE). Kindly get the correct code to proceed with the transaction.')
        onValidation(false)
      }
    } else {
      onValidation(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900">INPUT PayFlexCode CODE</label>
      <div className="relative">
        <input
          type={showCode ? 'text' : 'password'}
          value={PayFlexCodeCode}
          onChange={handleCodeChange}
          placeholder="Enter PayFlexCode Code"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          maxLength={CORRECT_PayFlexCode_CODE.length}
        />
        <button
          type="button"
          onClick={() => setShowCode(!showCode)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={() => window.location.href = '/buy-PayFlexCode'}
        className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
      >
        Buy PayFlexCode
      </button>
    </div>
  )
}
