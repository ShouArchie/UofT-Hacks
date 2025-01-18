'use client'

import React, { useState } from 'react'
import Header from '@/components/Header';

const ArgueMateAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (isLogin) {
      if (!email || !password) {
        setError('Both email and password are required.')
        return
      }
      console.log('Login:', email, password)
      alert('Login successful!')
    } else {
      if (!name || !email || !password || !confirmPassword) {
        setError('All fields are required.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      console.log('Signup:', name, email, password)
      alert('Signup successful!')
    }
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#FF8D58] font-['Poppins',sans-serif] text-[#FFEBD0]">
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 pt-20">
        {/* Logo and Tagline */}
        <div className="text-center mb-12">
          <h2 className="text-6xl font-light mb-4">ArgueMate</h2>
          <p className="text-2xl italic">A new perspective on dating</p>
        </div>

        {/* Auth Form */}
        <div className="w-full max-w-md bg-[#FFEBD0]/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <h3 className="text-3xl font-light text-center mb-8">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-[#FFEBD0]/20 border border-[#FFEBD0]/30 rounded-xl text-[#FFEBD0] placeholder-[#FFEBD0]/60 focus:outline-none focus:ring-2 focus:ring-[#FFEBD0]/50 focus:border-transparent"
                />
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-[#FFEBD0]/20 border border-[#FFEBD0]/30 rounded-xl text-[#FFEBD0] placeholder-[#FFEBD0]/60 focus:outline-none focus:ring-2 focus:ring-[#FFEBD0]/50 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                className="w-full px-4 py-3 bg-[#FFEBD0]/20 border border-[#FFEBD0]/30 rounded-xl text-[#FFEBD0] placeholder-[#FFEBD0]/60 focus:outline-none focus:ring-2 focus:ring-[#FFEBD0]/50 focus:border-transparent"
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-[#FFEBD0]/20 border border-[#FFEBD0]/30 rounded-xl text-[#FFEBD0] placeholder-[#FFEBD0]/60 focus:outline-none focus:ring-2 focus:ring-[#FFEBD0]/50 focus:border-transparent"
                />
              </div>
            )}
            {error && <p className="text-red-300 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#FFEBD0] text-[#FF8D58] py-3 px-6 rounded-full text-lg font-medium hover:opacity-90 transition-colors duration-300"
            >
              {isLogin ? 'Find Love' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium hover:underline focus:outline-none"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}

export default ArgueMateAuthPage

