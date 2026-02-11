'use client'

import { Search, ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: 'Shoes', href: '#shoes' },
    { label: 'Clothing', href: '#clothing' },
    { label: 'Collections', href: '#collections' },
    { label: 'New Arrivals', href: '#new' },
    { label: 'Designers', href: '#designers' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-900 bg-black/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/*<div className="h-8 w-8 gradient-yellow rounded-full"></div>*/}
            <span className="text-2xl font-bold tracking-tighter">
              X<span className="text-yellow-500"> TREME</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            <button className="hidden md:block">
              <Search className="h-5 w-5 text-gray-300 hover:text-yellow-500 transition-colors" />
            </button>
            <button className="relative">
              <ShoppingBag className="h-5 w-5 text-gray-300 hover:text-yellow-500 transition-colors" />
              <span className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-500 text-black text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-900 pt-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-yellow-500 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <button className="flex items-center space-x-2 text-gray-300 hover:text-yellow-500">
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar