'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Play, X, Film } from 'lucide-react'

interface VideoItem {
  id: string
  title: string
  category: string
  duration: string
  videoUrl: string
  thumbnailUrl?: string
}

const VIDEOS: VideoItem[] = [
  {
    id: '1',
    title: 'How to Maximize Your BPC CODE',
    category: 'Tutorials',
    duration: '5:32',
    videoUrl: '/bpc-code-guide.mp4',
  },
  {
    id: '2',
    title: 'Latest Crypto Market Trends',
    category: 'Market Updates',
    duration: '8:15',
    videoUrl: '/crypto-trends.mp4',
  },
  {
    id: '3',
    title: 'Money Management Tips',
    category: 'Tips',
    duration: '6:42',
    videoUrl: '/bpc-code-guide.mp4', // Temporary placeholder
  },
  {
    id: '4',
    title: 'Digital Banking Guide 2026',
    category: 'Tutorials',
    duration: '7:18',
    videoUrl: '/bpc-code-guide.mp4', // Temporary placeholder
  },
  {
    id: '5',
    title: 'Financial News Roundup',
    category: 'News',
    duration: '4:50',
    videoUrl: '/bpc-code-guide.mp4', // Temporary placeholder
  },
  {
    id: '6',
    title: 'Investment Basics',
    category: 'Tutorials',
    duration: '6:10',
    videoUrl: '/bpc-code-guide.mp4', // Temporary placeholder
  },
]

const CATEGORIES = ['All', 'News', 'Tips', 'Tutorials', 'Market Updates']

export default function WatchAndLearnPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)

  const filteredVideos =
    selectedCategory === 'All'
      ? VIDEOS
      : VIDEOS.filter((v) => v.category.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-3 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Watch & Learn</h1>
          <div className="w-5" />
        </div>
      </header>

      {/* Category Filter Pills */}
      <div className="bg-white border-b border-gray-200 px-3 py-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Cards List */}
      <main className="px-3 py-4 max-w-2xl mx-auto space-y-3">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer hover:shadow-md transition active:scale-[0.99]"
          >
            {/* Video Thumbnail Box */}
            <div className="relative w-28 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
              {video.thumbnailUrl ? (
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <Film className="w-8 h-8 text-gray-500" />
                </div>
              )}

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                  <Play className="w-4 h-4 text-gray-900 fill-gray-900 ml-0.5" />
                </div>
              </div>

              {/* Duration Tag */}
              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                {video.duration}
              </span>
            </div>

            {/* Video Title and Category */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug mb-1">
                {video.title}
              </h3>
              <p className="text-xs text-gray-500 font-medium">{video.category}</p>
            </div>
          </div>
        ))}
      </main>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-white">
              <h3 className="font-bold text-gray-900 text-sm truncate pr-2">
                {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
