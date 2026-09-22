'use client'

import React, { useState } from 'react'
import { Send, MessageCircle, BellRing, X } from 'lucide-react'

export default function ChannelNotificationModal() {
  const [isOpen, setIsOpen] = useState(true)

  const telegramUrl = 'https://t.me/payflexdigitalmine'
  const whatsappUrl = 'https://whatsapp.com/channel/0029Vb9knxOBqbr5BnIGMw1u'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-[#2a2a2a] rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 relative">
        
        {/* Close (X) Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
          <BellRing className="w-7 h-7 text-blue-400 animate-pulse" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white tracking-wide">
          Important Notice
        </h2>

        {/* Message */}
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Join our official Telegram and WhatsApp channels for the latest news, updates, and notifications on the PayFlex platform.
        </p>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg"
          >
            <Send className="w-4 h-4 fill-white" />
            Join Telegram Channel
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            Join WhatsApp Channel
          </a>
        </div>

        {/* Continue / Dismiss Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="text-xs text-white/50 hover:text-white pt-2 transition underline block mx-auto"
        >
          Continue to Dashboard
        </button>

      </div>
    </div>
  )
}

