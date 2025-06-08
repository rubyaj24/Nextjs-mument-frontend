'use client'
import Link from "next/link"
import { useState, useEffect } from "react"

const DashboardButtons = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated')
    setIsAuthenticated(auth === 'true')
  }, [])

  return (
    <>
      <div className="flex items-center justify-center gap-4 mt-8">
        {/* {isAuthenticated ? (
          <Link href="/dashboard" className="bg-white text-blue-600 px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors">
            Go to Dashboard
          </Link>
        ) : (
          <Link href="/signin" className="bg-white text-blue-600 px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors">
            Sign In to Continue
          </Link>
        )}
        <Link href="/about" className="bg-white text-blue-600 px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors">
          Learn More
        </Link> */}
        <p className="text-gray-200 text-2xl italic">
          Dashboard under construction. Please check back later.
        </p>
      </div>
    </>
  )
}

export default DashboardButtons