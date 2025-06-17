'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

// Add error type categorization
type ErrorCategory = 'credentials' | 'network' | 'server' | 'unknown';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [errorCategory, setErrorCategory] = useState<ErrorCategory | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrorCategory(null);
    setSuggestions([]);

    try {
      // Check for network connectivity first
      if (!navigator.onLine) {
        throw new Error('You appear to be offline. Please check your internet connection and try again.');
      }

      const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}));
        const statusCode = tokenResponse.status;
        
        // Handle different HTTP status codes
        if (statusCode === 401 || statusCode === 403) {
          throw new Error(errorData.detail || 'Invalid credentials');
        } else if (statusCode >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(errorData.detail || errorData.message || 'Sign-in failed');
        }
      }

      const tokenData = await tokenResponse.json();
      console.log('Token response:', tokenData);
      
      const accessToken = tokenData.access;
      console.log('Access token:', tokenData.access_token, tokenData.access, tokenData.token);
      
      if (accessToken) {
        // Clear any previous authentication data
        console.log('Clearing previous authentication data');
        localStorage.clear();
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
      let category: ErrorCategory = 'unknown';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Categorize the error
        if (errorMessage.includes('offline') || errorMessage.includes('network') || err instanceof TypeError) {
          category = 'network';
        } else if (errorMessage.includes('credentials') || errorMessage.includes('account') || 
                  errorMessage.includes('password') || errorMessage.includes('email')) {
          category = 'credentials';
        } else if (errorMessage.includes('server')) {
          category = 'server';
        }
      }
      
      setError(errorMessage);
      setErrorCategory(category);
      handleAuthError(errorMessage, category);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (errorMessage: string, category: ErrorCategory) => {
    // Handle different error categories
    switch (category) {
      case 'credentials':
        if (errorMessage.includes('No active account found')) {
          setSuggestions([
            'Double-check your email address for typos',
            'Try a different email if you have multiple accounts',
            'Create a new account if you haven\'t registered yet',
            'Contact support if you believe this is an error'
          ]);
        } else {
          setSuggestions([
            'Verify your password is correct',
            'Try resetting your password if you\'ve forgotten it',
            'Make sure you\'re using the email you registered with'
          ]);
        }
        break;
        
      case 'network':
        setSuggestions([
          'Check your internet connection',
          'Try again in a few moments',
          'If the problem persists, the server might be down'
        ]);
        break;
        
      case 'server':
        setSuggestions([
          'This is a temporary issue on our side',
          'Please try again in a few minutes',
          'If the problem persists, contact support'
        ]);
        break;
        
      default:
        setSuggestions([
          'Try refreshing the page and signing in again',
          'Clear your browser cache and cookies',
          'Try using a different browser',
          'Contact support if the issue continues'
        ]);
    }
  };

  // Enhanced error display with error categories
  const renderErrorMessage = () => {
    if (!error) return null;
    
    const errorIcons = {
      'credentials': '🔑',
      'network': '📶',
      'server': '🖥️',
      'unknown': '❓'
    };
    
    const icon = errorCategory ? errorIcons[errorCategory] : errorIcons.unknown;
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <span className="text-xl mr-2">{icon}</span>
          <div>
            <p className="text-red-800 font-medium">{error}</p>
            {suggestions.length > 0 && (
              <ul className="mt-2 text-sm text-red-700 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2"><Image src="/mument-black.png" alt="Logo" width={100} height={100} className='inline-block w-28 pt-1' /><span className='text-gray-500'> |</span> Sign In</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {renderErrorMessage()}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
            <span>Sign in successful! Redirecting...</span>
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
            <div className='relative'>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            </div>
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