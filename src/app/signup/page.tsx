'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';

// Define error types for better handling
type ErrorType = 'validation' | 'network' | 'server' | 'duplicate' | 'unknown';

// Interface for field-specific errors
interface FieldErrors {
  [key: string]: string;
}

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
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [success, setSuccess] = useState(false);

  // Clear field errors when user types in a field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  // Basic client-side validation
  const validateForm = () => {
    const errors: FieldErrors = {};
    let isValid = true;

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Name validation
    if (!formData.name) {
      errors.name = "Name is required";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    // Domain validation
    if (!formData.domain) {
      errors.domain = "Domain is required";
      isValid = false;
    }

    // Idea submission validation
    if (!formData.idea_submission) {
      errors.idea_submission = "Idea submission is required";
      isValid = false;
    } else if (formData.idea_submission.length < 50) {
      errors.idea_submission = "Please provide a more detailed idea (at least 50 characters)";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset all error states
    setGeneralError('');
    setErrorType(null);
    
    // Validate form before submission
    if (!validateForm()) {
      setErrorType('validation');
      return;
    }
    
    setIsLoading(true);
    
    try {      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup/`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        console.log('Signup successful:', data);
        
        // Store user email for signin convenience
        localStorage.setItem('signupEmail', formData.email);
        
        // Redirect to signin page after 1.5 seconds
        setTimeout(() => {
          router.push('/signin');
        }, 1500);
      } else {
        // Handle API error responses
        console.error('API error:', data);
        
        // Check for field-specific errors (Django REST style)
        if (typeof data === 'object' && data !== null) {
          const newFieldErrors: FieldErrors = {};
          let hasFieldErrors = false;
          
          // Process field-level errors
          Object.keys(data).forEach(key => {
            if (key in formData) {
              newFieldErrors[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
              hasFieldErrors = true;
            }
          });
          
          if (hasFieldErrors) {
            setFieldErrors(newFieldErrors);
            setErrorType('validation');
          } else {
            // General error message
            const errorMessage = data.message || data.error || data.detail || 'Signup failed';
            setGeneralError(errorMessage);
            
            // Determine error type
            if (errorMessage.includes('email') && errorMessage.includes('already')) {
              setErrorType('duplicate');
            } else {
              setErrorType('server');
            }
          }
        } else {
          // Fallback error handling
          setGeneralError('An unexpected error occurred. Please try again.');
          setErrorType('unknown');
        }
      }
    } catch (err) {
      setGeneralError('Network error. Please check your connection and try again.');
      setErrorType('network');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render error message with appropriate styling and guidance
  const renderErrorMessage = () => {
    if (!generalError && Object.values(fieldErrors).every(e => !e)) {
      return null;
    }
    
    const errorIcons = {
      'validation': '⚠️',
      'network': '📶',
      'server': '🖥️',
      'duplicate': '📝',
      'unknown': '❓'
    };
    
    const errorGuidance = {
      'validation': 'Please correct the highlighted fields and try again.',
      'network': 'Please check your internet connection and try again.',
      'server': 'Our servers are experiencing issues. Please try again later.',
      'duplicate': 'This email is already registered. Try signing in instead.',
      'unknown': 'An unexpected error occurred. Please try again or contact support.'
    };
    
    const icon = errorType ? errorIcons[errorType] : '⚠️';
    const guidance = errorType ? errorGuidance[errorType] : '';
    
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <span className="text-xl mr-2">{icon}</span>
          <div>
            {generalError && <p className="text-red-700 font-medium">{generalError}</p>}
            {guidance && <p className="text-red-600 mt-1 text-sm">{guidance}</p>}
            
            {Object.keys(fieldErrors).length > 0 && errorType === 'validation' && (
              <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                {Object.entries(fieldErrors).map(([field, error]) => 
                  error ? <li key={field}>{error}</li> : null
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-4'>
        <div className='w-full max-w-4xl bg-white p-8 rounded-2xl shadow-2xl'>
          <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'><Image src="/mument-black.png" alt="Logo" width={100} height={100} className='inline-block w-32 pt-1' /> <span className='text-gray-500'>|</span> Sign Up</h1>
          
          {/* Render error message */}
          {renderErrorMessage()}
          
          {success && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 text-green-700">
              <div className="flex items-center">
                <span className="text-xl mr-2">✅</span>
                <p>Signup successful! Redirecting to sign in page...</p>
              </div>
            </div>
          )}
          
          <div className='text-gray-600 mb-6 text-center'>Fill this form to create an account.</div>

          <form className='grid grid-cols-1 md:grid-cols-2 gap-6' onSubmit={handleSubmit}>
            <label className="flex flex-col">
              <span className="text-gray-700 font-medium mb-2">Email:</span>
              <input 
                className={`border p-3 rounded-lg ${fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all`}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder='Enter your email'
                required
              />
              {fieldErrors.email && <span className="text-red-500 text-sm mt-1">{fieldErrors.email}</span>}
            </label>
            
            <label className="flex flex-col">
              <span className="text-gray-700 font-medium mb-2">Password:</span>
              <input 
                className={`border p-3 rounded-lg ${fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all`}
                type="password"
                name="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter your password'
                required 
              />
              {fieldErrors.password && <span className="text-red-500 text-sm mt-1">{fieldErrors.password}</span>}
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
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
                  </span>
                ) : 'Sign Up'}
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