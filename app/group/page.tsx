'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Users } from 'lucide-react'

export default function GroupPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'groups' | 'create'>('groups')

  const userGroups = [
    { id: 1, name: 'Financial Tips', members: 234, description: 'Learn financial management' },
    { id: 2, name: 'Investment Club', members: 156, description: 'Share investment ideas' },
    { id: 3, name: 'Business Network', members: 89, description: 'Connect with entrepreneurs' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-2 px-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Community Groups</h1>
          <button className="p-1 text-[#0000ff]">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-11 z-40">
        <div className="flex px-3">
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'groups'
                ? 'border-[#0000ff] text-[#0000ff]'
                : 'border-transparent text-gray-600'
            }`}
          >
            My Groups
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'create'
                ? 'border-[#0000ff] text-[#0000ff]'
                : 'border-transparent text-gray-600'
            }`}
          >
            Create Group
          </button>
        </div>
      </div>

      <main className="px-3 py-3 max-w-2xl mx-auto">
        {activeTab === 'groups' && (
          <div className="space-y-3">
            {userGroups.map(group => (
              <div key={group.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">{group.name}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{group.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <p className="text-xs text-gray-600">{group.members.toLocaleString()} members</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Create New Group</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Group Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter group name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Description
                  </label>
                  <textarea
                    placeholder="What is this group about?"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Privacy
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0000ff]">
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>

                <button className="w-full bg-[#0000ff] text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition text-sm">
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
