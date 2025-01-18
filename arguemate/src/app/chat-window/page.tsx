'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion';

export default function ModernDatingAppChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'match', content: "Hey there! I saw your response to the goat farming in the alps question. I don't know how feasible it is to implement a goat farm in the big city, but I appreciate the effort to compromise" },
  ])
  {/* Thanks. You a real one Sarah. What would you do then?*/}
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const matchResponses = [
    "Think we could live in the city for half the year and with my goats the other half of the year.", 
    /* Wait lowkey not even that bad. I like how you think. */
    "Yeah that's why I'm the GOAT. #Lebron.",
    /* Alright goat. Would you be down to get dinner sometime? Are you vegetarian like a goat? */
    "I'm ok with anything!",
    /* Okay, I'll pick you up at 7 this Friday */
    "Sounds good. See you then!",
  ]
  
  const [responseIndex, setResponseIndex] = useState(0) // Track the current response index
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === '') return
  
    const newMessage = { id: messages.length + 1, sender: 'user', content: input }
    setMessages([...messages, newMessage])
    setInput('')
  
    if (responseIndex < matchResponses.length) {
      // Delay typing indicator by 2 seconds
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          const matchResponse = matchResponses[responseIndex] // Get the response in order
          setMessages(prev => [...prev, { id: prev.length + 1, sender: 'match', content: matchResponse }])
          setResponseIndex(prevIndex => prevIndex + 1) // Increment the index
          setIsTyping(false)
        }, 2000 + Math.random() * 2000) // Simulate response delay
      }, 2000) // Start typing after 2 seconds
    }
  }  

  return (
    <div className="flex flex-col h-screen bg-[#FFF8F0] text-[#333333] font-['Poppins',sans-serif]">
      <header className="bg-[#FF8D58] text-white p-4 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#FF8D58] font-bold text-xl">
            S
          </div>
          <h1 className="text-2xl font-semibold">Sarah</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map(m => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`rounded-2xl p-3 max-w-[80%] ${
                  m.sender === 'user'
                    ? 'bg-[#FF8D58] text-white'
                    : 'bg-[#FFEBD0] text-[#333333]'
                }`}>
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-[#FFEBD0] text-[#333333] rounded-2xl p-3 max-w-[80%]">
                <span className="flex items-center space-x-1">
                  <span>Sarah is typing</span>
                  <span className="animate-pulse">...</span>
                </span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="bg-white p-4 shadow-md">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-[#FFF8F0] text-[#333333] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#FF8D58] transition-shadow duration-200"
          />
          <button 
            type="submit" 
            className="px-6 py-2 rounded-full bg-[#FF8D58] text-white font-semibold hover:bg-[#FF7D48] focus:outline-none focus:ring-2 focus:ring-[#FF8D58] focus:ring-offset-2 transition-colors duration-200"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  )
}
