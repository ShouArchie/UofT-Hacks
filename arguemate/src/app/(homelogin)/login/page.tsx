'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

const ArgueMateAuthPage: React.FC = () => {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (isLogin) {
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        })
        
        if (result?.error) {
          setError('Invalid email or password')
          return
        }

        // If login successful, redirect to profiles
        router.push('/profiles')

      } catch (error) {
        console.error('Login error:', error)
        setError('An error occurred during login.')
      }
    } else {
      // Signup flow
      if (!name || !email || !password || !confirmPassword) {
        setError('All fields are required.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })

        if (!response.ok) {
          const data = await response.json()
          setError(data.message || 'An error occurred during signup.')
          return
        }

        // After successful signup, automatically sign in
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        })

        if (!result?.error) {
          router.push('/create-profile')
        } else {
          console.error('Sign in error:', result.error)
          setError('Account created but unable to sign in automatically.')
        }
      } catch (error) {
        setError('An error occurred during signup.')
        console.error('Signup error:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FF8D58] font-['Poppins',sans-serif] text-[#FFEBD0]">
      <Header />

      <main className="flex flex-col items-center justify-center px-4 pt-20">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-light mb-4">ArgueMate</h2>
          <p className="text-2xl italic">A new perspective on dating</p>
        </div>

        <div className="w-full max-w-md bg-[#FFEBD0]/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <h3 className="text-3xl font-light text-center mb-8">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h3>

          {error && (
            <div className="mb-6 p-3 bg-white/90 rounded-lg text-red-600 text-center">
              {error}
            </div>
          )}
          
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

