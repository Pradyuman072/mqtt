import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <div className="min-h-3 bg-black text-white relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>
      
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">SD</span>
            </div>
            <span className="font-bold">SensorDash</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
        
          <a href="hiw" className="text-sm hover:text-purple-400 transition-colors">
            How it Works
          </a>
        
          
        </nav>
        <div className="flex items-center gap-4">
          <a href="/signin" className="text-sm hover:text-purple-400 transition-colors">
            Sign In
          </a>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm">
            Get Started
          </button>
        </div>
      </header>
    </div>
  )
}

export default Navbar