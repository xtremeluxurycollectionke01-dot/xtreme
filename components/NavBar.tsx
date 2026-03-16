/*'use client'

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
          {/* Logo *
          <div className="flex items-center space-x-2">
            {/*<div className="h-8 w-8 gradient-yellow rounded-full"></div>*
            <span className="text-2xl font-bold tracking-tighter">
              X<span className="text-yellow-500"> TREME</span>
            </span>
          </div>

          {/* Desktop Navigation *
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

          {/* Right Side Actions *
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

        {/* Mobile Menu *
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

export default Navbar */ 



/*'use client'

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
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-gray-900 bg-black/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo *
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tighter">
              X<span className="text-yellow-500"> TREME</span>
            </span>
          </div>

          {/* Desktop Navigation *
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

          {/* Right Side Actions *
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

        {/* Mobile Menu *
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

*/

"use client";

import { Search, ShoppingBag, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  const navItems = [
    { label: "Shoes", href: "/shoes" },
    { label: "Clothing", href: "/clothing" },
    { label: "Collections", href: "/collections" },
    { label: "New Arrivals", href: "/new" },
    //{ label: "Designers", href: "/designers" },
  ];

  // Don't show anything while loading auth state
  if (loading) {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-gray-900 bg-black/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold tracking-tighter">
              X<span className="text-yellow-500"> TREME</span>
            </span>
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-gray-900 bg-black/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tighter">
              X<span className="text-yellow-500"> TREME</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            <button className="hidden md:block">
              <Search className="h-5 w-5 text-gray-300 hover:text-yellow-500 transition-colors" />
            </button>
            
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-5 w-5 text-gray-300 hover:text-yellow-500 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-500 text-black text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline">{user.name.split(" ")[0]}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-2 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-300 hover:bg-yellow-500 hover:text-black transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-gray-300 hover:bg-yellow-500 hover:text-black transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    {user.role === "admin" && (
                      <>
                        <Link
                          href="/admin/dashboard"
                          className="block px-4 py-2 text-gray-300 hover:bg-yellow-500 hover:text-black transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/admin/products"
                          className="block px-4 py-2 text-gray-300 hover:bg-yellow-500 hover:text-black transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Products
                        </Link>
                        <Link
                          href="/admin/users"
                          className="block px-4 py-2 text-gray-300 hover:bg-yellow-500 hover:text-black transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Users
                        </Link>
                        <Link
                          href="/admin/orders"
                          className="block px-4 py-2 text-gray-300 hover:bg-yellow-500 hover:text-black transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Orders
                        </Link>
                      </>
                    )}
                    <hr className="border-gray-800 my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-yellow-500 hover:text-black transition-colors flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:block px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Sign In
              </Link>
            )}

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
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-yellow-500 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button className="flex items-center space-x-2 text-gray-300 hover:text-yellow-500">
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
              
              {!user && (
                <Link
                  href="/login"
                  className="inline-block px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;