'use client'

import { Send } from 'lucide-react'
import { useState } from 'react'

const Newsletter = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Subscribing email:', email)
    setEmail('')
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 gradient-yellow rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 gradient-yellow rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-6 py-3 border border-yellow-500/30 rounded-full mb-8">
            <span className="text-yellow-500 font-semibold">EXCLUSIVE ACCESS</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            JOIN THE <span className="text-yellow-500">ÉLITE</span>
          </h2>
          
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Be the first to access limited editions, exclusive drops, and member-only events.
            Plus, get 15% off your first purchase.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 gradient-yellow text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                SUBSCRIBE
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Newsletter