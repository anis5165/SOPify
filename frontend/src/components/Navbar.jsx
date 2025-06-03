'use client'
import React, { useState, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FileText, Menu, X, LogOut } from 'lucide-react'
import { AppContext } from '@/context/AppContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useContext(AppContext)
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <>
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">SOPify</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-auto gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Contact us
          </Link>
          {isAuthenticated && (
            <Link href="/manage-sop" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Manage SOPs
            </Link>
          )}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex ml-6 items-center space-x-2">
          {isAuthenticated ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b z-40 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              href="/" 
              className="text-sm font-medium hover:text-blue-600 transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium hover:text-blue-600 transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium hover:text-blue-600 transition-colors"
              onClick={toggleMenu}
            >
              Contact us
            </Link>
            {isAuthenticated && (
              <Link 
                href="/manage-sop" 
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                onClick={toggleMenu}
              >
                Manage SOPs
              </Link>
            )}
            <div className="flex flex-col space-y-2 pt-4 border-t">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout()
                    toggleMenu()
                  }}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-sm font-medium hover:text-blue-600 transition-colors"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/signup" 
                    className="text-sm font-medium hover:text-blue-600 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    onClick={toggleMenu}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

export default Navbar