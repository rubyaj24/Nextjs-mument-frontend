'use client'
import Link from "next/link"
import { useState, useEffect } from "react"

const DashboardButtons = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated')
    const email = localStorage.getItem('userEmail')
    setIsAuthenticated(auth === 'true')
    setUserEmail(email || '')
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    setIsAuthenticated(false)
    setUserEmail('')
  }

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="flex items-center justify-center gap-4 mt-8">
        {isAuthenticated ? (
          <>
            <div className="text-center">
              <div className="flex gap-3">
                <Link href="/dashboard" className="bg-white text-blue-600 px-6 py-3 rounded-2xl hover:bg-blue-700 hover:text-white transition-colors">
                  Go to Dashboard
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="bg-red-500 text-white px-6 py-3 rounded-2xl hover:bg-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link href="/signin" className="bg-white text-blue-600 px-6 py-3 rounded-2xl hover:bg-blue-700 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="bg-green-500 text-white px-6 py-3 rounded-2xl hover:bg-green-600 transition-colors">
              Sign Up
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center justify-center mt-4">
        {isAuthenticated && (
          <p className="text-white text-sm mb-2">Welcome back, {userEmail}!</p>
        )}
      </div>
    </div>
  )
}

export default DashboardButtons