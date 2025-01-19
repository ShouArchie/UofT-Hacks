'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Loader2, MessageSquare, AlertCircle, MapPin, Heart } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'

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
  compatibilityAnalysis: string
  keyStrengths: string[]
  potentialChallenges: string[]
  isFromToronto: boolean
  currentIndex: number
  totalProfiles: number
  compatibilityReason: string
  currentUserCity: string
}

export default function MatchesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [displayedCount, setDisplayedCount] = useState(1)
  
  // Setup intersection observer for infinite scroll
  const { ref: bottomRef, inView } = useInView({
    threshold: 0.5,
  })

  const fetchMatches = async () => {
    try {
      setLoading(true)
      setAnalyzing(true)
      console.log('Fetching matches...', { session, status })
      const response = await fetch('/api/matches')
      
      if (!response.ok) {
        const data = await response.json()
        if (response.status === 401) {
          console.log('Session expired, redirecting to login')
          router.push('/login')
          return
        }
        if (response.status === 404 && data.error === 'Please create a profile first') {
          console.log('No profile found, redirecting to create profile')
          router.push('/create-profile')
          return
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Matches data:', data)
      setMatches(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching matches:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      setMatches([])
    } finally {
      setLoading(false)
      setAnalyzing(false)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMatches()
    }
  }, [status])

  // Load more profiles when bottom is in view
  useEffect(() => {
    if (inView && displayedCount < matches.length) {
      setDisplayedCount(prev => Math.min(prev + 1, matches.length))
    }
  }, [inView, matches.length])

  if (status === 'loading' || loading || analyzing) {
    return (
      <>
        <NavBar />
        <div className="flex flex-col h-screen items-center justify-center gap-4">
          <Loader2 className="h-16 w-16 animate-spin text-[#FF661E]" />
          <p className="text-xl font-medium text-[#FF661E]">
            {analyzing ? "Analyzing compatibility..." : "Loading matches..."}
          </p>
        </div>
      </>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect in useEffect
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="flex h-screen flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Matches</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8 px-4 pt-20">
        <h1 className="mb-8 text-3xl font-bold text-center">Your Matches</h1>
        <div className="space-y-8">
          {matches
            .sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0))
            .slice(0, displayedCount)
            .map((match, index) => (
            <div 
              key={match.user.id} 
              className="max-w-2xl mx-auto overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-8">
                <div className="mb-6 flex items-center gap-6 justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-primary/10">
                      <img 
                        src={match.user.image || '/placeholder.svg'} 
                        alt={match.user.name || 'User'} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#FF661E]">{match.user.name}</h2>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{match.city}</span>
                        {match.city?.toLowerCase() === match.currentUserCity?.toLowerCase() && (
                          <span className="ml-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                            {match.city} Match
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{match.age} years old</p>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/chat-window?userId=${match.user.id}`}
                    className="flex items-center justify-center h-12 w-12 rounded-full bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                  >
                    <MessageSquare className="h-6 w-6" />
                  </Link>
                </div>

                <div className="mb-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-[#FF661E]">About</h3>
                    <p className="text-[#FF661E]">{match.bio}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-[#FF661E]">Occupation</h3>
                    <p className="text-[#FF661E]">{match.occupation}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-[#FF661E]">Compatibility Analysis</h3>
                    <p className="text-[#FF661E] mb-3">{match.compatibilityReason}</p>
                    
                    {match.keyStrengths && match.keyStrengths.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-green-700 mb-2">Key Strengths</h4>
                        <div className="flex flex-wrap gap-2">
                          {match.keyStrengths.map((strength, i) => (
                            <span 
                              key={i}
                              className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {match.potentialChallenges && match.potentialChallenges.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-amber-700 mb-2">Potential Challenges</h4>
                        <div className="flex flex-wrap gap-2">
                          {match.potentialChallenges.map((challenge, i) => (
                            <span 
                              key={i}
                              className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full"
                            >
                              {challenge}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className={`h-5 w-5 ${(match.compatibilityScore || 0) >= 80 ? 'text-red-500' : 'text-gray-400'}`} />
                    <span className="text-lg font-semibold text-primary">
                      {match.compatibilityScore || 0}% Compatible
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                  Profile {match.currentIndex} of {match.totalProfiles}
                </div>
              </div>
            </div>
          ))}
          
          {/* Intersection observer target */}
          <div ref={bottomRef} className="h-10" />
          
          {displayedCount < matches.length && (
            <div className="text-center text-gray-500 animate-pulse">
              Scroll for next match
            </div>
          )}
        </div>
      </div>
    </>
  )
}

