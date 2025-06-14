'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Pre-fill email from signup if available
  useEffect(() => {
    const signupEmail = localStorage.getItem('signupEmail')
    if (signupEmail) {
      setFormData(prev => ({ ...prev, email: signupEmail }))
      localStorage.removeItem('signupEmail') // Clean up
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.detail || errorData.message || 'Invalid credentials');
      }

      const tokenData = await tokenResponse.json();
      console.log('Token response:', tokenData);
      
      const accessToken = tokenData.access;
      console.log('Access token:', tokenData.access_token, tokenData.access, tokenData.token);
      
      if (accessToken) {
        // Store authentication data
        localStorage.setItem('token', accessToken);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', formData.email);
        
        // Store refresh token if available
        if (tokenData.refresh_token || tokenData.refresh) {
          localStorage.setItem('refreshToken', tokenData.refresh_token || tokenData.refresh);
        }

        setSuccess(true);
        console.log('Authentication successful, redirecting to dashboard...');
        
        // Navigate to dashboard after a brief delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        throw new Error('No access token received from server');
      }
      
    } catch (err: unknown) {
      console.error('Sign in error:', err);
      setSuccess(false);
      let errorMessage = 'Sign in failed. Please check your credentials and try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2"><Image src="/mument-black.png" alt="Logo" width={100} height={100} className='inline-block w-28 pt-1' /><span className='text-gray-500'> |</span> Sign In</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Sign in successful! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Dont have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn