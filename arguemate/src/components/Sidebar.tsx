'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-[#FF8D58] text-white flex flex-col z-50 transition-all duration-300 ${
        isOpen ? 'w-60' : 'w-16'
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 bg-[#FF8D58] text-white p-1 rounded-full"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
      <nav className="flex flex-col items-center pt-16 space-y-8">
        <Link href="/home" className={`flex items-center space-x-4 ${pathname === '/home' ? 'text-[#FFEBD0]' : ''}`}>
          <Home size={24} />
          <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {isOpen && 'Home'}
          </span>
        </Link>
        <Link href="/profile" className={`flex items-center space-x-4 ${pathname === '/profile' ? 'text-[#FFEBD0]' : ''}`}>
          <User size={24} />
          <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {isOpen && 'Profile'}
          </span>
        </Link>
        <Link href="/chat" className={`flex items-center space-x-4 ${pathname === '/chat' ? 'text-[#FFEBD0]' : ''}`}>
          <MessageCircle size={24} />
          <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {isOpen && 'Chat'}
          </span>
        </Link>
      </nav>
    </div>
  )
}

export default Sidebar

