'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2, MessageSquare, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Match {
  user: {
    id: string
    name: string
    image: string
  }
  age: number
  city: string
  bio: string
  occupation: string
  compatibilityScore: number
}

export default function MatchesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    async function fetchMatches() {
      if (status !== 'authenticated') return;

      try {
        const response = await fetch('/api/matches', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // This ensures cookies are sent with the request
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from API')
        }
        setMatches(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching matches:', error)
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
        setMatches([])
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchMatches()
    }
  }, [status, session])

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Matches</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="mb-8 text-3xl font-bold">Your Matches</h1>
        <p className="text-xl text-gray-600">No matches found at the moment. Check back later!</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Matches</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <div key={match.user.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full">
                  <img 
                    src={match.user.image || '/placeholder.svg'} 
                    alt={match.user.name || 'User'} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{match.user.name}</h2>
                  <p className="text-sm text-gray-600">
                    {match.age} • {match.city}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">{match.bio}</p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Occupation:</span> {match.occupation}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-semibold">Compatibility:</span>{' '}
                  {match.compatibilityScore}%
                </div>
                <button 
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

