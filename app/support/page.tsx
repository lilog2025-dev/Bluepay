'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail } from 'lucide-react'

export default function SupportPage() {
  const router = useRouter()
  const [complaintName, setComplaintName] = useState('')
  const [complaintCategory, setComplaintCategory] = useState('Transaction Issue')
  const [complaintDetails, setComplaintDetails] = useState('')

  const supportEmail = 'supportPayFlexpro.com@gmail.com'

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault()
    if (!complaintName.trim() || !complaintDetails.trim()) {
      alert('Please fill in your full name and complaint details.')
      return
    }

    const subject = encodeURIComponent(`PayFlex Complaint: ${complaintCategory} - from ${complaintName}`)
    const body = encodeURIComponent(
      `Name: ${complaintName}\nCategory: ${complaintCategory}\n\nComplaint Details:\n${complaintDetails}`
    )

    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-3 px-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="p-1 cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Support & Feedback</h1>
          <div className="w-5" />
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Contact Support Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900 text-sm">Contact Support</h2>
          
          <div className="grid grid-cols-1 gap-3">
            <a
              href={`mailto:${supportEmail}?subject=PayFlex%20Support%20Request&body=Hello%20PayFlex%20Support%20Team,%0A%0AI%20need%20assistance%20with...`}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition text-left w-full cursor-pointer"
            >
              <div className="p-2.5 bg-blue-50 text-[#0000ff] rounded-xl shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-medium">Contact Us via Email</p>
                <p className="font-semibold text-gray-900 text-sm truncate">{supportEmail}</p>
              </div>
            </a>
          </div>
        </div>

        {/* File a Complaint Form */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <h2 className="font-bold text-gray-900 text-sm mb-4">File a Complaint</h2>
          
          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name..."
                value={complaintName}
                onChange={(e) => setComplaintName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Complaint Category
              </label>
              <select 
                value={complaintCategory}
                onChange={(e) => setComplaintCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff] bg-white"
              >
                <option value="Transaction Issue">Transaction Issue</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Account Issue">Account Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Complaint Details
              </label>
              <textarea
                placeholder="Describe your complaint in detail..."
                rows={4}
                value={complaintDetails}
                onChange={(e) => setComplaintDetails(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0000ff] text-white font-bold py-3 rounded-xl hover:opacity-90 transition text-sm cursor-pointer shadow-sm"
            >
              Submit Complaint via Gmail
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
