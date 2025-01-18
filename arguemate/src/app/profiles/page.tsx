'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Sidebar from '@/components/Sidebar'

interface Profile {
  id: string
  preferredName: string
  age: number
  gender: string
  city: string
  bio: string
  occupation: string
  debateStyle: string
  communicationPreference: string
  image?: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.email) {
      fetchProfile()
    }
  }, [status, router, session])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/profile?email=${session?.user?.email}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else {
        console.error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!profile) {
    return <div className="container mx-auto px-4 py-8">No profile found.</div>
  }

  return (
    <div className="flex min-h-screen bg-[#FFEBD0]">
      <Sidebar />
      <main className="flex-1 p-8 ml-16">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-48 bg-[#FF8D58]">
            {profile.image && (
              <Image
                src={profile.image || "/placeholder.svg"}
                alt={`${profile.preferredName}'s profile`}
                layout="fill"
                objectFit="cover"
              />
            )}
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-[#FF8D58] mb-2">{profile.preferredName}</h1>
            <p className="text-gray-600 mb-4">{profile.age} years old, {profile.gender}</p>
            <p className="text-gray-800 mb-4">{profile.bio}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#FF8D58]">Location</h2>
                <p>{profile.city}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#FF8D58]">Occupation</h2>
                <p>{profile.occupation}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#FF8D58]">Debate Style</h2>
                <p>{profile.debateStyle}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#FF8D58]">Communication Preference</h2>
                <p>{profile.communicationPreference}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

