'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Mail, Phone, MapPin, TrendingUp, Users, Loader2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { getTransactions } from '@/lib/balance-store'

export default function ProfilePage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [totalReferrals, setTotalReferrals] = useState(0)

  const getSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return null
    return createClient(supabaseUrl, supabaseKey)
  }

  useEffect(() => {
    const loadUserData = async () => {
      // 1. Try pulling from Supabase session
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

      // 2. Fallback to localStorage if state is still empty
      if (typeof window !== 'undefined') {
        const localEmail = localStorage.getItem('userEmail') || localStorage.getItem('user_email') || localStorage.getItem('email')
        const localName = localStorage.getItem('userName') || localStorage.getItem('user_name') || localStorage.getItem('fullName')
        const localImage = localStorage.getItem('profileImage') || localStorage.getItem('user_avatar')

        if (localEmail) setEmail((prev) => prev || localEmail)
        if (localName) setFullName((prev) => prev || localName)
        if (localImage) setProfileImage((prev) => prev || localImage)

        // Load real transaction count
        const txs = getTransactions()
        setTotalTransactions(txs.length)

        // Load real referral count (defaults to 0 stored in localStorage)
        const storedReferrals = localStorage.getItem('totalReferrals')
        setTotalReferrals(storedReferrals ? parseInt(storedReferrals, 10) : 0)
      }
    }

    loadUserData()

    const handleStorageChange = () => {
      const txs = getTransactions()
      setTotalTransactions(txs.length)
      const storedReferrals = localStorage.getItem('totalReferrals')
      setTotalReferrals(storedReferrals ? parseInt(storedReferrals, 10) : 0)
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

      // Local preview fallback if Supabase storage upload is unavailable
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-2 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold text-[#0000ff] px-2 py-1"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
      </header>

      <main className="px-3 py-3 max-w-2xl mx-auto">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 mb-3">
            <div className="w-24 h-24 rounded-full bg-[#0000ff] flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-inner">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                fullName ? fullName.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-[#0000ff] rounded-full p-1.5 cursor-pointer hover:opacity-90 shadow-md">
                <Camera className="w-4 h-4 text-white" />
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
          <h2 className="text-lg font-bold text-gray-900">{fullName || 'User'}</h2>
          <p className="text-xs text-gray-600">{email || 'No email provided'}</p>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Account Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#0000ff]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600">Email</p>
                <p className="font-semibold text-gray-900 text-sm break-all">{email || 'No email provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#0000ff]" />
              <div className="flex-1">
                <p className="text-xs text-gray-600">Phone</p>
                <p className="font-semibold text-gray-900 text-sm">+234 (Update in settings)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#0000ff]" />
              <div className="flex-1">
                <p className="text-xs text-gray-600">Location</p>
                <p className="font-semibold text-gray-900 text-sm">Nigeria</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#0000ff]" />
              <p className="text-xs text-gray-600 font-semibold">Total Transactions</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{totalTransactions}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#0000ff]" />
              <p className="text-xs text-gray-600 font-semibold">Referrals</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{totalReferrals}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button className="w-full bg-white border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50 transition text-sm">
            Security Settings
          </button>
          <button className="w-full bg-white border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50 transition text-sm">
            Notification Preferences
          </button>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full bg-red-50 border border-red-200 text-red-600 font-bold py-2.5 rounded-lg hover:bg-red-100 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50"
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
