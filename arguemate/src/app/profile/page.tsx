'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import NavBar from '@/components/NavBar'

interface Profile {
  age: number
  city: string
  bio: string
  occupation: string
  communicationPreference: string
  debateStyle: string
  conflictQuestions: string[]
  conflictAnswers: string[]
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    age: 0,
    city: '',
    bio: '',
    occupation: '',
    communicationPreference: '',
    debateStyle: '',
    conflictQuestions: [],
    conflictAnswers: []
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetchProfile()
    }
  }, [status, session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      if (!response.ok) throw new Error('Failed to update profile')
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <>
        <NavBar />
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto max-w-2xl px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Update Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Age</label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">City</label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Occupation</label>
            <input
              type="text"
              value={profile.occupation}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Communication Preference</label>
            <select
              value={profile.communicationPreference}
              onChange={(e) => setProfile({ ...profile, communicationPreference: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              required
            >
              <option value="" className="text-gray-500">Select a preference</option>
              <option value="Direct" className="text-gray-900">Direct</option>
              <option value="Diplomatic" className="text-gray-900">Diplomatic</option>
              <option value="Analytical" className="text-gray-900">Analytical</option>
              <option value="Empathetic" className="text-gray-900">Empathetic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Debate Style</label>
            <select
              value={profile.debateStyle}
              onChange={(e) => setProfile({ ...profile, debateStyle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              required
            >
              <option value="" className="text-gray-500">Select a style</option>
              <option value="Logical" className="text-gray-900">Logical</option>
              <option value="Emotional" className="text-gray-900">Emotional</option>
              <option value="Collaborative" className="text-gray-900">Collaborative</option>
              <option value="Competitive" className="text-gray-900">Competitive</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#FF8D58] text-white py-2 px-4 rounded-md hover:bg-[#FF8D58]/90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </>
  )
} 