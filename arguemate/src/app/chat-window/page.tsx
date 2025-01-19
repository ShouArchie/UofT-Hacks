'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'

interface Message {
  id: string
  content: string
  sender: 'user' | 'match'
  timestamp: Date
}

const defaultProfile = {
  user: { name: 'Sarah', id: 'sarah', image: null },
  age: 24,
  city: 'Toronto',
  communicationPreference: 'Direct and honest',
  debateStyle: 'Respectful and open-minded',
  interests: ['AI', 'Psychology', 'Travel'],
  occupation: 'AI Researcher'
}

export default function ChatWindow() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const matchId = searchParams?.get('userId')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [matchProfile, setMatchProfile] = useState<any>(null)
  const [fetchingProfile, setFetchingProfile] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initializeProfile = async () => {
      setFetchingProfile(true)
      if (matchId) {
        try {
          const response = await fetch(`/api/profile/${matchId}`)
          if (response.ok) {
            const data = await response.json()
            setMatchProfile(data)
          } else {
            console.error('Failed to fetch profile, using default')
            setMatchProfile(defaultProfile)
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
          setMatchProfile(defaultProfile)
        }
      } else {
        setMatchProfile(defaultProfile)
      }
      setFetchingProfile(false)
    }

    initializeProfile()
  }, [matchId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading || !matchProfile) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          matchProfile
        })
      })

      if (response.ok) {
        const data = await response.json()
        const matchMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: 'match',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, matchMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || fetchingProfile) {
    return (
      <>
        <NavBar />
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF8D58]" />
        </div>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <div className="flex flex-col h-screen bg-gray-100 pt-16">
        {/* Chat header */}
        <div className="bg-white shadow-sm p-4 flex items-center">
          <Link href="/matches" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-[#FF8D58]" />
          </Link>
          <div>
            <h2 className="font-semibold text-lg">{matchProfile.user.name}</h2>
            <p className="text-sm text-gray-500">
              {matchProfile.age} • {matchProfile.city}
            </p>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-[#FF8D58] text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <form onSubmit={handleSendMessage} className="bg-white p-4 shadow-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#FF8D58]"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newMessage.trim()}
              className="bg-[#FF8D58] text-white p-2 rounded-full hover:bg-[#FF8D58]/90 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6" />
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
