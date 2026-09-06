'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Play, Pause, X, Film, TrendingUp } from 'lucide-react'
import { getBalance, updateBalance } from '@/lib/balance-store'

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
    videoUrl: '/bpc-code-guide.mp4.mp4',
  },
  {
    id: '2',
    title: 'Latest Crypto Market Trends',
    category: 'Market Updates',
    duration: '8:15',
    videoUrl: '/crypto-trends.mp4.mp4',
  },
  {
    id: '3',
    title: 'Money Management Tips',
    category: 'Tips',
    duration: '6:42',
    videoUrl: '/bpc-code-guide.mp4.mp4',
  },
  {
    id: '4',
    title: 'Digital Banking Guide 2026',
    category: 'Tutorials',
    duration: '7:18',
    videoUrl: '/bpc-code-guide.mp4.mp4',
  },
]

const CATEGORIES = ['All', 'News', 'Tips', 'Tutorials', 'Market Updates']

export default function WatchAndLearnPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [balance, setBalance] = useState<number>(250000)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [secondsWatched, setSecondsWatched] = useState<number>(0)
  const [sessionEarnings, setSessionEarnings] = useState<number>(0)

  // 1. Load balance on mount & listen to balance store changes
  useEffect(() => {
    setBalance(getBalance())

    const handleBalanceChange = () => {
      setBalance(getBalance())
    }

    window.addEventListener('balanceChange', handleBalanceChange)
    return () => window.removeEventListener('balanceChange', handleBalanceChange)
  }, [])

  // 2. Guaranteed 1-second interval addition while video modal is active and playing
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (activeVideo && isPlaying) {
      timer = setInterval(() => {
        setSecondsWatched((prev) => prev + 1)
        setSessionEarnings((prev) => prev + 100)

        // Force balance addition of +100 Naira directly to store
        setBalance((prevBal) => {
          const nextBal = prevBal + 100
          updateBalance(nextBal)
          return nextBal
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [activeVideo, isPlaying])

  const handleOpenVideo = (video: VideoItem) => {
    setActiveVideo(video)
    setIsPlaying(true) // Start earnings immediately upon opening video modal
  }

  const handleCloseModal = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setIsPlaying(false)
    setActiveVideo(null)
  }

  const filteredVideos =
    selectedCategory === 'All'
      ? VIDEOS
      : VIDEOS.filter((v) => v.category.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-3 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Watch & Earn</h1>
          <div className="w-5" />
        </div>
      </header>

      {/* Live Balance Summary */}
      <div className="px-3 pt-3 max-w-2xl mx-auto">
        <div className="bg-[#0000ff] rounded-2xl p-4 text-white shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-blue-200 font-medium">Available Balance</p>
              <h2 className="text-2xl font-bold mt-1">
                NGN {balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            {isPlaying && (
              <span className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                +₦100 / sec
              </span>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-blue-400/30 flex justify-between text-xs text-blue-100">
            <span>Watch Time: {secondsWatched}s</span>
            <span>Earned: +₦{sessionEarnings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white border-b border-gray-200 px-3 py-3 my-3 overflow-x-auto no-scrollbar">
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

      {/* Video Cards */}
      <main className="px-3 py-1 max-w-2xl mx-auto space-y-3">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => handleOpenVideo(video)}
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer hover:shadow-md transition active:scale-[0.99]"
          >
            <div className="relative w-28 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
              {video.thumbnailUrl ? (
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <Film className="w-8 h-8 text-gray-500" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                  <Play className="w-4 h-4 text-gray-900 fill-gray-900 ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                {video.duration}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug mb-1">
                {video.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">{video.category}</p>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +₦100/sec
                </span>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Video Player Modal with Direct Play Controls */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-white">
              <h3 className="font-bold text-gray-900 text-sm truncate pr-2">
                {activeVideo.title}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                <source src={activeVideo.videoUrl} type="video/mp4" />
                Your browser does not support video playback.
              </video>

              {isPlaying && (
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +₦100 / sec
                </div>
              )}
            </div>

            {/* Manual Toggle Controls */}
            <div className="p-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
              <p className="text-xs text-gray-600 font-medium">
                {isPlaying ? (
                  <span className="text-emerald-600 font-bold animate-pulse">
                    Session Active (+₦100/sec)
                  </span>
                ) : (
                  <span className="text-amber-600 font-bold">Session Paused</span>
                )}
              </p>

              <button
                onClick={() => {
                  if (isPlaying) {
                    if (videoRef.current) videoRef.current.pause()
                    setIsPlaying(false)
                  } else {
                    if (videoRef.current) videoRef.current.play()
                    setIsPlaying(true)
                  }
                }}
                className="px-3 py-1.5 bg-[#0000ff] text-white font-bold rounded-lg text-xs flex items-center gap-1 hover:bg-blue-700 transition"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Resume Earning
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
