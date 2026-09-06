'use client'

import { useState } from 'react'
import { Search, ChevronDown, Check, X } from 'lucide-react'
import { NIGERIAN_BANKS, Bank } from '@/lib/nigerian-banks'

interface BankSelectorProps {
  selectedBank: Bank | null
  onSelectBank: (bank: Bank) => void
}

export function BankSelector({ selectedBank, onSelectBank }: BankSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBanks = NIGERIAN_BANKS.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative w-full">
      {/* Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-left text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        <span className={selectedBank ? 'text-gray-900 font-semibold' : 'text-gray-400'}>
          {selectedBank ? selectedBank.name : 'Choose Bank'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
            
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base">Select Bank</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b bg-gray-50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search banks, MFBs, fintechs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  autoFocus
                />
              </div>
            </div>

            {/* Bank List */}
            <div className="overflow-y-auto flex-1 divide-y divide-gray-100 max-h-[350px]">
              {filteredBanks.length > 0 ? (
                filteredBanks.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => {
                      onSelectBank(bank)
                      setIsOpen(false)
                      setSearchQuery('')
                    }}
                    className="w-full text-left px-4 py-3.5 hover:bg-blue-50 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{bank.name}</p>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                        {bank.type}
                      </span>
                    </div>
                    {selectedBank?.id === bank.id && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No bank found matching "{searchQuery}"
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

