'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Mail, MapPin, TrendingUp, Loader2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

export default function ProfilePage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [totalTransactions, setTotalTransactions] = useState(0)

  const getSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return null
    return createClient(supabaseUrl, supabaseKey)
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = getSupabaseClient()
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            if (session.user.email) setEmail(session.user.email)
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, profile_image_url')
              .eq('id', session.user.id)
              .single()
            if (profile?.full_name) setFullName(profile.full_name)
            if (profile?.profile_image_url) setProfileImage(profile.profile_image_url)
          }
        }
      } catch (err) {
        console.error('[v0] Error loading Supabase profile:', err)
      }

      if (typeof window !== 'undefined') {
        const localEmail = localStorage.getItem('userEmail') || localStorage.getItem('user_email') || localStorage.getItem('email') || sessionStorage.getItem('signupEmail')
        const localName = localStorage.getItem('userName') || localStorage.getItem('user_name') || localStorage.getItem('fullName') || sessionStorage.getItem('signupFullName')
        const localImage = localStorage.getItem('profileImage') || localStorage.getItem('user_avatar')

        setEmail((prev) => prev || localEmail || '')
        setFullName((prev) => prev || localName || '')
        if (localImage) setProfileImage((prev) => prev || localImage)

        try {
          const savedTxs = localStorage.getItem('transactions')
          if (savedTxs) {
            const parsed = JSON.parse(savedTxs)
            if (Array.isArray(parsed)) setTotalTransactions(parsed.length)
          }
        } catch (e) {
          setTotalTransactions(0)
        }
      }
    }

    loadUserData()

    const handleStorageChange = () => {
      try {
        const savedTxs = localStorage.getItem('transactions')
        if (savedTxs) {
          const parsed = JSON.parse(savedTxs)
          if (Array.isArray(parsed)) setTotalTransactions(parsed.length)
        }
      } catch (e) {
        setTotalTransactions(0)
      }
    }

    window.addEventListener('transactionsChange', handleStorageChange)
    return () => window.removeEventListener('transactionsChange', handleStorageChange)
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const supabase = getSupabaseClient()
      
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const filename = `profile-${session.user.id}-${Date.now()}.jpg`
          const { error } = await supabase.storage
            .from('profile-images')
            .upload(filename, file)

          if (!error) {
            const { data: { publicUrl } } = supabase.storage
              .from('profile-images')
              .getPublicUrl(filename)

            setProfileImage(publicUrl)
            localStorage.setItem('profileImage', publicUrl)

            await supabase
              .from('profiles')
              .update({ profile_image_url: publicUrl })
              .eq('id', session.user.id)
            return
          }
        }
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Url = reader.result as string
        setProfileImage(base64Url)
        localStorage.setItem('profileImage', base64Url)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('[v0] Error uploading image:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const supabase = getSupabaseClient()
      if (supabase) {
        await supabase.auth.signOut().catch(() => {})
      }

      if (typeof window !== 'undefined') {
        sessionStorage.clear()
        localStorage.clear()
      }

      router.push('/signin')
      router.refresh()
    } catch (err) {
      console.error('[v0] Sign out error:', err)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#181818] border-b border-[#2a2a2a] py-2 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1 text-white/80 hover:text-white">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold text-[#00B67A] px-2 py-1"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
      </header>

      <main className="px-3 py-3 max-w-2xl mx-auto space-y-3">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 mb-3">
            <div className="w-24 h-24 rounded-full bg-[#00B67A] flex items-center justify-center text-black text-3xl font-bold overflow-hidden shadow-inner">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                fullName ? fullName.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-[#00B67A] rounded-full p-1.5 cursor-pointer hover:opacity-90 shadow-md">
                <Camera className="w-4 h-4 text-black" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <h2 className="text-lg font-bold text-white">{fullName || 'User'}</h2>
          <p className="text-xs text-white/60">{email || 'No email provided'}</p>
        </div>

        {/* Account Details */}
        <div className="bg-[#181818] rounded-lg p-3 border border-[#2a2a2a]">
          <h3 className="font-bold text-white text-sm mb-3">Account Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#00B67A]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60">Email</p>
                <p className="font-semibold text-white text-sm break-all">{email || 'No email provided'}</p>
              </div>
            </div>
            <div className="updated-row flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#00B67A]" />
              <div className="flex-1">
                <p className="text-xs text-white/60">Location</p>
                <p className="font-semibold text-white text-sm">Nigeria</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <div className="bg-[#181818] rounded-lg p-3 border border-[#2a2a2a]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#00B67A]" />
              <p className="text-xs text-white/60 font-semibold">Total Transactions</p>
            </div>
            <p className="text-lg font-bold text-white">{totalTransactions}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold py-2.5 rounded-lg hover:bg-red-500/20 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSigningOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing Out...
              </>
            ) : (
              'Sign Out'
            )}
          </button>
        </div>
      </main>
    </div>
  )
}
