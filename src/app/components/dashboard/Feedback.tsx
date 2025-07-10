import React, { useState, useEffect } from 'react'

const Feedback = () => {
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [errors, setErrors] = useState({ feedback: '', general: '' });

    // Google Sheets Web App URL - Replace with your actual deployed Web App URL
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwL9S_-vo9iBaTmx392ny6WvJatC9GubjQQVYrA9i0KNuavJhtYiEK6lwg7B_WtmZEtQw/exec';

    // Clear errors when user starts typing
    const clearErrors = () => {
        setErrors({ feedback: '', general: '' });
        setSubmitStatus('');
    };

    // Validate feedback input
    const validateFeedback = (text: string): string => {
        if (!text.trim()) {
            return 'Feedback is required';
        }
        if (text.trim().length < 10) {
            return 'Feedback must be at least 10 characters long';
        }
        if (text.trim().length > 1000) {
            return 'Feedback must be less than 1000 characters';
        }
        return '';
    };

    // Fetch user details from API on component mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token found:', !!token); // Debug log
                
                if (!token) {
                    console.log('No token found, using email fallback');
                    const userEmail = localStorage.getItem('userEmail') || '';
                    console.log('Email from localStorage:', userEmail);
                    
                    setUserInfo({
                        name: userEmail ? userEmail.split('@')[0] : '',
                        email: userEmail
                    });
                    return;
                }

                console.log('Fetching user data from API...');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/details/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('API response status:', response.status);

                if (response.ok) {
                    const userData = await response.json();
                    console.log('Full user data received:', userData);
                    
                    // Extract name with comprehensive fallback logic from API response
                    const extractedName = userData.name || 
                                        userData.first_name || 
                                        userData.firstName || 
                                        userData.username || 
                                        userData.display_name ||
                                        userData.full_name ||
                                        (userData.email ? userData.email.split('@')[0] : '');
                    
                    console.log('Extracted name:', extractedName);
                    
                    setUserInfo({
                        name: extractedName,
                        email: userData.email || localStorage.getItem('userEmail') || ''
                    });
                } else {
                    console.log('API request failed with status:', response.status);
                    // If API fails, try to get email from localStorage but force a name extraction
                    const userEmail = localStorage.getItem('userEmail') || '';
                    console.log('Using email fallback:', userEmail);
                    
                    setUserInfo({
                        name: userEmail ? userEmail.split('@')[0] : '',
                        email: userEmail
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                // If everything fails, use email from localStorage
                const userEmail = localStorage.getItem('userEmail') || '';
                console.log('Error fallback - using email:', userEmail);
                
                setUserInfo({
                    name: userEmail ? userEmail.split('@')[0] : '',
                    email: userEmail
                });
            }
        };

        fetchUserInfo();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        // Clear previous errors
        setErrors({ feedback: '', general: '' });
        setSubmitStatus('');
        
        // Validate feedback
        const feedbackError = validateFeedback(feedback);
        if (feedbackError) {
            setErrors(prev => ({ ...prev, feedback: feedbackError }));
            return;
        }

        // Check if Google Sheets URL is configured
        if (!GOOGLE_SHEETS_URL) {
            setErrors(prev => ({ 
                ...prev, 
                general: 'Feedback system is not configured. Please contact support.' 
            }));
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', userInfo.name || 'User');
            formData.append('email', userInfo.email || 'No email provided');
            formData.append('feedback', feedback.trim());
            formData.append('timestamp', new Date().toISOString());

            console.log('Submitting feedback with user info:', {
                name: userInfo.name || 'Anonymous',
                email: userInfo.email || 'No email provided',
                feedback: feedback.trim().substring(0, 50) + '...'
            });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            // Try to parse response as JSON
            let responseData;
            try {
                responseData = await response.json();
            } catch (parseError) {
                // If JSON parsing fails, treat as success if status is ok
                console.warn('Response parsing failed, but status is ok:', parseError);
            }

            // Check if response indicates success
            if (responseData && responseData.success === false) {
                throw new Error(responseData.error || 'Unknown server error');
            }

            setSubmitStatus('Thank you! Your feedback has been submitted successfully.');
            setFeedback('');
            
        } catch (error) {
            console.error("Error submitting feedback:", error);
            
            let errorMessage = 'Sorry, there was an error submitting your feedback. Please try again.';
            
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    errorMessage = 'Request timed out. Please check your internet connection and try again.';
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Network error. Please check your internet connection and try again.';
                } else if (error.message.includes('Server error')) {
                    errorMessage = 'Server error. Please try again later or contact support.';
                } else if (error.message.includes('not configured')) {
                    errorMessage = error.message;
                } else {
                    errorMessage = `Error: ${error.message}`;
                }
            }
            
            setErrors(prev => ({ ...prev, general: errorMessage }));
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Feedback</h1>
        <p className="text-gray-600 mb-4">We value your feedback! Please let us know how we can improve.</p>
        
        {/* Display general errors */}
        {errors.general && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">{errors.general}</p>
            </div>
        )}
        
        {/* Display user info if available */}
        {(userInfo.name || userInfo.email) && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md border">
                <p className="text-sm text-gray-600">Submitting as:</p>
                {userInfo.name && <p className="text-sm font-medium text-gray-800">{userInfo.name}</p>}
                {userInfo.email && <p className="text-sm text-gray-600">{userInfo.email}</p>}
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Feedback *
                </label>
                <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => {
                        setFeedback(e.target.value);
                        clearErrors();
                    }}
                    placeholder="Share your thoughts, suggestions, or report any issues..."
                    rows={5}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-vertical ${
                        errors.feedback 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                    }`}
                />
                {errors.feedback && (
                    <p className="mt-1 text-sm text-red-600">{errors.feedback}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                    {feedback.length}/1000 characters
                </p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                    isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                } text-white transition-colors`}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
        </form>

        {/* Success message */}
        {submitStatus && (
            <div className="mt-4 p-3 rounded-md bg-green-100 text-green-700 border border-green-300">
                {submitStatus}
            </div>
        )}
    </div>
  )
}

export default Feedback