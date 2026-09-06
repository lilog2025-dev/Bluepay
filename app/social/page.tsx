'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react'

export default function SocialPage() {
  const router = useRouter()

  const feeds = [
    {
      id: 1,
      author: 'Ahmed Hassan',
      avatar: 'A',
      time: '2 hours ago',
      content: 'Just earned ₦5,000 from referrals! PayFlex is amazing 🎉',
      likes: 234,
      comments: 45,
      liked: false,
    },
    {
      id: 2,
      author: 'Zainab Ibrahim',
      avatar: 'Z',
      time: '4 hours ago',
      content: 'Tip: Always check your email for BPC CODE updates. Stay secure!',
      likes: 567,
      comments: 89,
      liked: false,
    },
    {
      id: 3,
      author: 'Chisom Okonkwo',
      avatar: 'C',
      time: '6 hours ago',
      content: 'Just completed my 100th transaction on PayFlex! 💪',
      likes: 345,
      comments: 67,
      liked: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-2 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Community Feed</h1>
          <div className="w-5" />
        </div>
      </header>

      <main className="px-3 py-3 max-w-2xl mx-auto">
        {/* Create Post */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full bg-[#0000ff] flex items-center justify-center text-white font-bold flex-shrink-0">
              Y
            </div>
            <input
              type="text"
              placeholder="Share your thought..."
              className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
            />
          </div>
        </div>

        {/* Feed Posts */}
        <div className="space-y-3">
          {feeds.map(post => (
            <div key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Post Header */}
              <div className="p-3 flex items-center gap-2 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#0000ff] flex items-center justify-center text-white font-bold flex-shrink-0">
                  {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{post.author}</p>
                  <p className="text-xs text-gray-600">{post.time}</p>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-3">
                <p className="text-sm text-gray-900 leading-relaxed">{post.content}</p>
              </div>

              {/* Post Actions */}
              <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-around">
                <button className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#0000ff] transition">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#0000ff] transition">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#0000ff] transition">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
