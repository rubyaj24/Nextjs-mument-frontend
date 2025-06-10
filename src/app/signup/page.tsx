'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';

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
    
    try {
      const response = await fetch('http://localhost:8000/api/users/signup/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': 'ICLld71x8PFTA71Hsku5zK2dEljJTevGPfu4ghH8olWNslWujgcOPpagWQKfR7qg'
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
        <div className='w-full max-w-md bg-gray-100 p-6 m-6 rounded-2xl shadow-lg'>
            <h1 className='text-2xl font-bold mb-4 text-center'>Sign Up</h1>
            {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
            {success && <div className="text-green-500 mb-2 text-sm">Signup successful! Redirecting to signin...</div>}
            {<div className='text-gray-500 mb-2 text-sm'>Fill this form to create an account.</div>}

            <form className='flex flex-col w-full' onSubmit={handleSubmit}>
                <label className="mb-3">
                    Email:
                    <input className='border p-2 rounded-lg w-full mt-1 border-gray-400'
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Enter your email'
                        required
                    />
                </label>
                
                <label className="mb-3">
                    Password:
                    <input className='border p-2 rounded-lg w-full mt-1 border-gray-400'
                        type="password"
                        name="password" 
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='Enter your password'
                        required 
                    />
                </label>

                <label className="mb-3">
                    Name:
                    <input className='border p-2 rounded-lg w-full mt-1 border-gray-400'
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Enter your name'
                        required 
                    />
                </label>

                <label className="mb-3">
                    Phone:
                    <input className='border p-2 rounded-lg w-full mt-1 border-gray-400'
                        type="tel" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder='Enter your phone number'
                        required 
                    />
                </label>

                <label className="mb-3">
                    Profile Image URL (optional):
                    <input className='border p-2 rounded-lg w-full mt-1 border-gray-400'
                        type="url" 
                        name="img_url" 
                        value={formData.img_url}
                        onChange={handleChange}
                        placeholder='Enter your profile image URL'
                    />
                </label>

                <label className="mb-3">
                    MU ID (optional):
                    <input className='border p-2 rounded-lg w-full mt-1 border-gray-400'
                        type="text" 
                        name="mu_id" 
                        value={formData.mu_id}
                        onChange={handleChange}
                        placeholder='Enter your MU ID'
                    />
                </label>

                <label className="mb-3">
                    Domain (optional):
                    <input className='border p-2 rounded-lg w-full mt-1 border-gray-400'
                        type="text" 
                        name="domain" 
                        value={formData.domain}
                        onChange={handleChange}
                        placeholder='Enter your domain of interest'
                        required
                    />
                </label>

                <label className="mb-3">
                    Team (optional):
                    <input className='border p-2 rounded-lg w-full mt-1 border-gray-400'
                        type="text" 
                        name="team" 
                        value={formData.team}
                        onChange={handleChange}
                        placeholder='Enter your team name'
                    />
                </label>

                <label className="mb-4">
                    Idea Submission:
                    <textarea className='border p-2 rounded-lg w-full mt-1 h-24 resize-none border-gray-400'
                        name="idea_submission" 
                        value={formData.idea_submission}
                        onChange={handleChange}
                        required
                        placeholder="Describe your idea..."
                    />
                </label>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
            <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in here
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

export default Page