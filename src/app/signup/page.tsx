'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    img_url: '',
    mu_id: '',
    phone: '',
    domain: '',
    idea_submission: '',
    team: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup/`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        console.log('Signup successful:', data);
        
        // Store user email for signin convenience
        localStorage.setItem('signupEmail', formData.email);
        
        // Redirect to signin page after 1.5 seconds
        setTimeout(() => {
          router.push('/signin');
        }, 1500);
      } else {
        const errorData = await response.json();
        // Handle different error response structures
        const errorMessage = errorData.message || errorData.error || errorData.detail || 'Signup failed';
        setError(errorMessage);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-4'>
        <div className='w-full max-w-4xl bg-white p-8 rounded-2xl shadow-2xl'>
          <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'><Image src="/mument-black.png" alt="Logo" width={100} height={100} className='inline-block w-32 pt-1' /> <span className='text-gray-500'>|</span> Sign Up</h1>
          {error && <div className="text-red-500 mb-4 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
          {success && <div className="text-green-500 mb-4 text-sm bg-green-50 p-3 rounded-lg">Signup successful! Redirecting to signin...</div>}
          <div className='text-gray-600 mb-6 text-center'>Fill this form to create an account.</div>

          <form className='grid grid-cols-1 md:grid-cols-2 gap-6' onSubmit={handleSubmit}>
            <label className="flex flex-col">
              <span className="text-gray-700 font-medium mb-2">Email:</span>
              <input className='border p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder='Enter your email'
                required
              />
            </label>
            
            <label className="flex flex-col">
              <span className="text-gray-700 font-medium mb-2">Password:</span>
              <input className='border p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
                type="password"
                name="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter your password'
                required 
              />
            </label>

            <label className="flex flex-col">
              <span className="text-gray-700 font-medium mb-2">Name:</span>
              <input className='border p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder='Enter your name'
                required 
              />
            </label>

            <label className="flex flex-col">
              <span className="text-gray-700 font-medium mb-2">Phone:</span>
              <input className='border p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
                type="tel" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                placeholder='Enter your phone number'
                required 
              />
            </label>

            <label className="flex flex-col">
              <span className="text-gray-700 font-medium mb-2">Profile Image URL (optional):</span>
              <input className='border p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
                type="url" 
                name="img_url" 
                value={formData.img_url}
                onChange={handleChange}
                placeholder='Enter your profile image URL'
              />
            </label>

            <label className="flex flex-col">
              <span className="text-gray-700 font-medium mb-2">μ ID (optional):</span>
              <input className='border p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
                type="text" 
                name="mu_id" 
                value={formData.mu_id}
                onChange={handleChange}
                placeholder='Enter your μ ID'
              />
            </label>

            <label className="flex flex-col">
              <span className="text-gray-700 font-medium mb-2">Domain:</span>
              <input className='border p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
                type="text" 
                name="domain" 
                value={formData.domain}
                onChange={handleChange}
                placeholder='Enter your domain of interest'
                required
              />
            </label>

            <label className="flex flex-col">
              <span className="text-gray-700 font-medium mb-2">Team (optional):</span>
              <input className='border p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
                type="text" 
                name="team" 
                value={formData.team}
                onChange={handleChange}
                placeholder='Enter your team name'
              />
            </label>

            <label className="flex flex-col md:col-span-2">
              <span className="text-gray-700 font-medium mb-2">Idea Submission:</span>
              <textarea className='border p-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-32 resize-none'
                name="idea_submission" 
                value={formData.idea_submission}
                onChange={handleChange}
                required
                placeholder="Describe your idea..."
              />
            </label>

            <div className="md:col-span-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium text-lg"
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
    </div>
  )
}

export default Page