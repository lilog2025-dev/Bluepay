'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MessageSquare, HelpCircle, AlertCircle, Mail, MessageCircle } from 'lucide-react'

export default function SupportPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'ai-chat' | 'support' | 'review' | 'complaint'>('ai-chat')
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; type: 'user' | 'ai'; text: string }>>([])
  const [isAITyping, setIsAITyping] = useState(false)

  // AI Support Knowledge Base
  const aiKnowledgeBase: Record<string, string> = {
    'bpc code': 'To get your BPC CODE: 1. Go to Buy BPC page 2. Enter amount 3. Make transfer 4. Upload receipt 5. Verify payment. You\'ll receive your BPC CODE via email within 24 hours.',
    'withdrawal': 'To withdraw: 1. Go to Withdraw 2. Enter amount and bank details 3. Confirm 4. You\'ll receive debit alert via email. Withdrawals typically process within 2-3 business days.',
    'referral': 'Earn rewards by referring friends! Each successful referral earns you 1000 NGN. Share your unique referral code via Refer & Earn page. There\'s no limit to how much you can earn!',
    'airtime': 'Buy airtime by: 1. Select network (MTN, GLO, etc.) 2. Enter phone number 3. Choose amount 4. Confirm purchase. Airtime is delivered instantly!',
    'data': 'Purchase data: 1. Go to Data page 2. Select network 3. Choose data plan 4. Confirm. Data is activated immediately on your phone.',
    'transaction': 'View all your transactions on the Transactions page. Each transaction shows: Type, Amount, Status, Date & Time, and Transaction ID.',
    'account': 'Account issues can be resolved through: 1. Security settings to reset PIN 2. Profile page to update details 3. Contact support for technical issues.',
    'default': 'Hello! I\'m BLUEPAY AI Assistant. I can help you with: BPC CODE, Withdrawals, Referrals, Airtime, Data, Transactions, and Account issues. What would you like help with?'
  }

  const findAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    for (const [key, response] of Object.entries(aiKnowledgeBase)) {
      if (lowerInput.includes(key)) {
        return response
      }
    }
    return aiKnowledgeBase['default']
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    // Add user message
    const userMsg = { id: Date.now().toString(), type: 'user' as const, text: message }
    setChatMessages(prev => [...prev, userMsg])
    setMessage('')

    // Simulate AI thinking
    setIsAITyping(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    // Get AI response
    const aiResponse = findAIResponse(message)
    const aiMsg = { id: (Date.now() + 1).toString(), type: 'ai' as const, text: aiResponse }
    setChatMessages(prev => [...prev, aiMsg])
    setIsAITyping(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-2 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Support & Feedback</h1>
          <div className="w-5" />
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-11 z-40">
        <div className="flex px-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ai-chat')}
            className={`px-2 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'ai-chat'
                ? 'border-[#0000ff] text-[#0000ff]'
                : 'border-transparent text-gray-600'
            }`}
          >
            AI Chat
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-2 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'support'
                ? 'border-[#0000ff] text-[#0000ff]'
                : 'border-transparent text-gray-600'
            }`}
          >
            Support
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-2 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'review'
                ? 'border-[#0000ff] text-[#0000ff]'
                : 'border-transparent text-gray-600'
            }`}
          >
            Review
          </button>
          <button
            onClick={() => setActiveTab('complaint')}
            className={`px-2 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'complaint'
                ? 'border-[#0000ff] text-[#0000ff]'
                : 'border-transparent text-gray-600'
            }`}
          >
            Complaint
          </button>
        </div>
      </div>

      <main className="px-3 py-3 max-w-2xl mx-auto">
        {/* Contact Methods */}
        <div className="bg-gradient-to-r from-blue-50 to-[#0000ff]/5 rounded-2xl p-3 border border-[#0000ff]/20 mb-4">
          <h3 className="font-bold text-gray-900 text-xs mb-3">Quick Contact Support</h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Email Support */}
            <a
              href="mailto:supportbluepaypro.com@gmail.com"
              className="bg-white rounded-lg p-2.5 border border-gray-200 hover:border-[#0000ff] hover:shadow-md transition"
            >
              <div className="flex flex-col items-center text-center gap-1">
                <Mail className="w-5 h-5 text-[#0000ff]" />
                <p className="font-semibold text-gray-900 text-xs">Email Support</p>
                <p className="text-xs text-gray-600 truncate">supportbluepaypro.com@gmail.com</p>
              </div>
            </a>

            {/* WhatsApp Support */}
            <a
              href="https://wa.me/2347078434086?text=Hello%20BLUEPAY%20Support%2C%20I%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-2.5 border border-gray-200 hover:border-green-500 hover:shadow-md transition"
            >
              <div className="flex flex-col items-center text-center gap-1">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <p className="font-semibold text-gray-900 text-xs">WhatsApp Chat</p>
                <p className="text-xs text-gray-600">+234 707 843 4086</p>
              </div>
            </a>
          </div>
        </div>

        {/* AI Chat Tab */}
        {activeTab === 'ai-chat' && (
          <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-96">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {chatMessages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-[#0000ff]/30 mx-auto mb-2" />
                    <p className="text-gray-600 text-xs font-medium">Start a conversation with AI Support</p>
                    <p className="text-gray-500 text-xs mt-1">Ask me about withdrawals, BPC, referrals, and more!</p>
                  </div>
                </div>
              )}
              
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-lg p-2.5 text-xs ${
                    msg.type === 'user'
                      ? 'bg-[#0000ff] text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAITyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 rounded-lg rounded-bl-none p-2.5">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isAITyping || !message.trim()}
                  className="px-3 py-2 bg-[#0000ff] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition text-xs font-semibold"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-3">
            {/* FAQ */}
            <h3 className="font-bold text-gray-900 text-sm mt-3 mb-2">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {[
                { q: 'How do I get my BPC CODE?', a: 'Visit Buy BPC page and follow the steps' },
                { q: 'Why is my payment pending?', a: 'Payments are verified within 24 hours' },
                { q: 'How do I reset my PIN?', a: 'Go to security settings to reset PIN' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex gap-2">
                    <HelpCircle className="w-5 h-5 text-[#0000ff] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{item.q}</p>
                      <p className="text-xs text-gray-600 mt-1">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Chat */}
            <div className="bg-[#0000ff]/10 rounded-lg p-3 border border-[#0000ff]/20 mt-4">
              <p className="text-xs text-gray-900 mb-2 font-semibold">Need more help?</p>
              <button className="w-full bg-[#0000ff] text-white font-bold py-2 rounded-lg hover:opacity-90 transition text-sm">
                Start Live Chat
              </button>
            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 mt-3">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Share Your Feedback</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  How would you rate BLUEPAY?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className="text-2xl hover:scale-110 transition"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Your Feedback
                </label>
                <textarea
                  placeholder="Tell us what you think..."
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
                />
              </div>

              <button className="w-full bg-[#0000ff] text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition text-sm">
                Submit Review
              </button>
            </div>
          </div>
        )}

        {activeTab === 'complaint' && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 mt-3">
            <h3 className="font-bold text-gray-900 text-sm mb-3">File a Complaint</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Complaint Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff]">
                  <option>Transaction Issue</option>
                  <option>Technical Issue</option>
                  <option>Account Issue</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Complaint Details
                </label>
                <textarea
                  placeholder="Describe your complaint..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
                />
              </div>

              <button className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition text-sm">
                Submit Complaint
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
