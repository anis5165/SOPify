import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <h1 className="text-3xl font-bold animate-fadeIn">SOPify</h1>
        <nav className="space-x-6 text-lg">

          <Link href="/manage-sop" className="hover:underline transition duration-300 hover:text-gray-300">
            Manage SOPs
          </Link>
          <Link href="/about" className="hover:underline transition duration-300 hover:text-gray-300">
            About 
          </Link>
          <Link href="/contact" className="hover:underline transition duration-300 hover:text-gray-300">
            Contact
          </Link>
          <Link href="/login" className="hover:underline transition duration-300 hover:text-gray-300">
            Log in
          </Link>
          <Link href="/signup" className="hover:underline transition duration-300 hover:text-gray-300">
            Sign up
          </Link>
        </nav>
      </header>
    </>
  )
}

export default Navbar