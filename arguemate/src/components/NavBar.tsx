'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Heart, User } from 'lucide-react'

export default function NavBar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-center items-center h-16">
          <div className="flex space-x-12">
            <Link
              href="/matches"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/matches')
                  ? 'text-[#FF8D58] border-b-2 border-[#FF8D58]'
                  : 'text-gray-500 hover:text-[#FF8D58]'
              }`}
            >
              <Heart className="h-5 w-5 mr-1.5" />
              Matches
            </Link>

            <Link
              href="/chat-window"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/chat-window')
                  ? 'text-[#FF8D58] border-b-2 border-[#FF8D58]'
                  : 'text-gray-500 hover:text-[#FF8D58]'
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-1.5" />
              Chat
            </Link>

            <Link
              href="/profile"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/profile')
                  ? 'text-[#FF8D58] border-b-2 border-[#FF8D58]'
                  : 'text-gray-500 hover:text-[#FF8D58]'
              }`}
            >
              <User className="h-5 w-5 mr-1.5" />
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 