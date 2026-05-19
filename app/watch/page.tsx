'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Play, Zap } from 'lucide-react'

export default function WatchPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['All', 'News', 'Tips', 'Tutorials', 'Market Updates']
  
  const videos = [
    { id: 1, title: 'How to Maximize Your BPC CODE', category: 'Tutorials', thumbnail: '🎥', duration: '5:32' },
    { id: 2, title: 'Latest Crypto Market Trends', category: 'Market Updates', thumbnail: '📈', duration: '8:15' },
    { id: 3, title: 'Money Management Tips', category: 'Tips', thumbnail: '💰', duration: '6:42' },
    { id: 4, title: 'Digital Banking Guide 2026', category: 'Tutorials', thumbnail: '🏦', duration: '7:18' },
    { id: 5, title: 'Financial News Roundup', category: 'News', thumbnail: '📰', duration: '9:05' },
    { id: 6, title: 'Investment Basics', category: 'Tips', thumbnail: '📊', duration: '6:50' },
  ]

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-2 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Watch & Learn</h1>
          <div className="w-5" />
        </div>
      </header>

      <main className="px-3 py-3 max-w-2xl mx-auto">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-3 px-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category.toLowerCase())}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm font-semibold transition ${
                selectedCategory === category.toLowerCase()
                  ? 'bg-[#0000ff] text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="space-y-3">
          {filteredVideos.map(video => (
            <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex gap-3 p-2.5">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-4xl flex-shrink-0 relative">
                  {video.thumbnail}
                  <button className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </button>
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <p className="font-bold text-gray-900 text-sm line-clamp-2">{video.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{video.category}</p>
                  </div>
                  <p className="text-xs text-gray-500">{video.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
