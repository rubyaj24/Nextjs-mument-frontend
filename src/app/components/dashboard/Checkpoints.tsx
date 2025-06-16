'use client'
import { useState, useEffect } from "react"

interface WeeklyUpdate {
  id: number;
  uuid: string;
  title: string;
  content: string;
  created_at: string;
}

const WeeklyUpdates = () => {
  const [updates, setUpdates] = useState<WeeklyUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/daily-report/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch updates');
      }

      if(response.status === 204) {
        setError('No updates found');
        return;
      }
      
      const data = await response.json();
      setUpdates(data);
    } catch (error) {
      console.error("Error fetching updates:", error);
      setError('Failed to fetch updates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/submit/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit update');
      }
      
      const data = await response.json();
      console.log("Update submitted:", data);
      
      // Reset form and refresh updates
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      await fetchUpdates();
    } catch (error) {
      console.error("Error submitting update:", error);
      setError('Failed to submit update');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
        <h1 className="text-2xl font-semibold mb-4">Checkpoints</h1>
        <p className="text-gray-600 mb-6">
            Share your weekly updates here. This helps keep track of your progress and share insights with the community.
        </p>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className='p-6 bg-white rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Submit Your Checkpoints</h2>
          <p className='text-gray-600 mb-4'>Please provide a title and content for your checkpoint.</p>
          <form className='mt-4' onSubmit={handleSubmit}>
              <label className='block mb-2 text-sm font-medium text-gray-700'>
                  Checkpoint Title:
                  <input 
                      type='text' 
                      name='title'
                      required
                      maxLength={255}
                      className='mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500'
                      placeholder='Enter checkpoint title'
                  />
              </label>
              <label className='block mb-2 text-sm font-medium text-gray-700'>
                  Checkpoint Content:
                  <input
                      type='text' 
                      name='content'
                      required
                      className='mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500'
                      placeholder='Enter your drive link contains image here'
                  />
              </label>
              <button 
                  type='submit' 
                  disabled={submitting}
                  className='mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400'
              >
                  {submitting ? 'Submitting...' : 'Submit Update'}
              </button>
          </form>
        </div>

        <div className='mt-8'>
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
        </div>
    </>
  )
}

export default WeeklyUpdates