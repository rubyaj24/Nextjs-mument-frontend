'use client'
import { useState, useEffect } from "react"

const Checkpoints = () => {
  const [buttonText, setButtonText] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [imgUrlError, setImgUrlError] = useState('');

  useEffect(() => {
    // fetchUpdates();
  }, []);

  // const fetchUpdates = async () => {
  //   try {
  //     setLoading(true);
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/daily-report/`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
      
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch updates');
  //     }

  //     if(response.status === 204) {
  //       setError('No updates found');
  //       return;
  //     }
      
  //     const data = await response.json();
  //     setUpdates(data);
  //   } catch (error) {
  //     console.error("Error fetching updates:", error);
  //     setError('Failed to fetch updates');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Add a validation function for Google Drive links
  const validateGoogleDriveLink = (url: string): boolean => {
    // Check if it's a Google Drive link
    if (!url.includes('drive.google.com')) {
      setImgUrlError('URL must be a Google Drive link');
      return false;
    }
    
    // Check if it ends with usp=sharing
    if (!url.endsWith('usp=sharing')) {
      setImgUrlError('Google Drive link must end with "usp=sharing"');
      return false;
    }
    
    setImgUrlError(''); // Clear error if validation passes
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset all error states
    setError('');
    setSuccess('');
    setImgUrlError('');
    
    const formData = new FormData(e.currentTarget);
    const checkpoint = formData.get("checkpoint") as string;
    const title = formData.get("title") as string;
    const description = formData.get("content") as string;
    const image_url = formData.get("img_url") as string;
    
    // Validate Google Drive link
    if (!validateGoogleDriveLink(image_url)) {
      // Focus the input field to draw attention to the error
      const imgUrlInput = document.querySelector('input[name="img_url"]') as HTMLInputElement;
      if (imgUrlInput) imgUrlInput.focus();
      return;
    }
    
    const email = localStorage.getItem('userEmail') || '';
    if (!email) {
      setError('User email not found');
      return;
    }

    setSubmitting(true);
    setButtonText('submitting');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkpoint/add-checkpoint/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ checkpoint, title, description, image_url, email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit update');
      }
      
      const data = await response.json();
      console.log("Update submitted:", data);
      setSuccess('Update submitted successfully');
      setButtonText('success');
      
      // Reset form
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error("Error submitting update:", error);
      setError('Failed to submit update');
      setButtonText('error');
    } finally {
      setSubmitting(false);
    }
  };

  // Add this effect to reset button state after delay
  useEffect(() => {
    if (buttonText === 'success' || buttonText === 'error') {
      const timer = setTimeout(() => {
        setButtonText('idle');
      }, 3000); // Reset after 3 seconds
    
      return () => clearTimeout(timer);
    }
  }, [buttonText]);

  // Update getButtonContent for better consistency
  const getButtonContent = () => {
    switch (buttonText) {
      case 'submitting':
        return (
          <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        </span>
        );
      case 'success':
        return (
          <span className="flex items-center">
            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Checkpoint Submitted!
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center">
            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Failed to Submit
          </span>
        );
      default:
        return 'Submit Checkpoint';
    }
  };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   });
  // };

  return (
  <>
    <h1 className="text-2xl font-semibold mb-4">Checkpoints</h1>
    <p className="text-gray-600 mb-6">
      Share your weekly updates here. This helps keep track of your progress and share insights with the community.
    </p>
    
    {/* Display error message */}
    {error && (
      <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {error}
      </div>
    )}
    
    {/* Display success message */}
    {success && (
      <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        {success}
      </div>
    )}

    <div className='p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-4'>Submit Your Checkpoints</h2>
      <p className='text-gray-600 mb-4'>Please provide a title and content for your checkpoint.</p>
      <form className='mt-4' onSubmit={handleSubmit}>
        <label className='block mb-2 text-sm font-medium text-gray-700'>
          Checkpoint :
          <input 
              type='text' 
              name='checkpoint'
              required
              maxLength={255}
              className='mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 transition-all focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter checkpoint # (e.g., 1, 2, 3, etc.)'
          />
        </label>
        <label className='block mb-2 text-sm font-medium text-gray-700'>
          Checkpoint Title:
          <input 
            type='text' 
            name='title'
                  required
                  maxLength={255}
                  className='mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 transition-all focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Enter checkpoint title'
          />
            </label>
          <label className='block mb-2 text-sm font-medium text-gray-700'>
              Checkpoint Content:
              <textarea 
                  name='content'
                  required
                  maxLength={1000}
                  className='mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 transition-all focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Enter checkpoint content (max 1000 characters)'
                  rows={4}
              />
          </label>
          <label className='block mb-2 text-sm font-medium text-gray-700'>
            Checkpoint Proof:
            <div className="bg-blue-100 p-3 rounded-md my-2">
              <ul className="text-blue-600 list-disc list-inside space-y-1.5">
                <li>Image link must be a Google Drive link</li>
                <li>Image link must be publicly accessible</li>
                <li>Image link must end with <strong>usp=sharing</strong></li>
                <li className="flex flex-wrap items-center">
                  <span>Example: </span>
                  <div className="mt-1 bg-blue-50 p-2 rounded overflow-x-auto max-w-full">
                    <code className="text-xs text-blue-800 whitespace-normal break-all">
                      https://drive.google.com/file/d/your_image_id/view?usp=sharing
                    </code>
                  </div>
                </li>
              </ul>
            </div>
            <input
              type='text' 
              name='img_url'
              required
              className={`mt-1 block w-full border ${imgUrlError ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-1 transition-all focus:ring-blue-500 focus:border-blue-500`}
              placeholder='Enter your drive link contains image here'
              onChange={() => {
                if (imgUrlError) setImgUrlError('');
              }}
            />
            {imgUrlError && (
              <p className="mt-1 text-sm text-red-600">{imgUrlError}</p>
            )}
          </label>
          <button 
            type='submit' 
            disabled={submitting}
            className={`mt-4 px-4 py-2 rounded-lg transition-colors ${
              buttonText === 'error' 
                ? 'bg-red-600 hover:bg-red-700' 
                : buttonText === 'success' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
            } text-white disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {getButtonContent()}
          </button>
        </form>
      </div>

      {/* <div className='mt-8'>
          <h2 className='text-xl font-semibold mb-4'>Your Recent Updates</h2>
          <p className='text-gray-600 mb-4'>Here are your most recent updates:</p>
          {loading ? (
            <div className='bg-white p-4 rounded-lg shadow-md'>
              <p className='text-gray-500'>Loading updates...</p>
            </div>
          ) : updates.length > 0 ? (
            <div className='space-y-4'>
              {updates.map((update) => (
                <div key={update.id} className='bg-white p-4 rounded-lg shadow-md'>
                  <div className='flex justify-between items-start mb-2'>
                    <h3 className='text-lg font-semibold text-gray-800'>{update.title}</h3>
                    <span className='text-sm text-gray-500'>{formatDate(update.created_at)}</span>
                  </div>
                  <p className='text-gray-700 whitespace-pre-wrap'>{update.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-white p-4 rounded-lg shadow-md'>
              <p className='text-gray-500'>No updates available yet. Be the first to share!</p>
            </div>
          )}
      </div> */}
    </>
  )
}

export default Checkpoints