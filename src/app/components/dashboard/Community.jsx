import { useState, useEffect } from 'react'
import { FaXmark } from 'react-icons/fa6'

const Community = () => {
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [checkpointSubmissions, setCheckpointSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleThumbClick = (e) => {
    const index = parseInt(e.currentTarget.dataset.index)
    const submissionData = checkpointSubmissions[index]
    setSelectedSubmission(submissionData)
    setShowOverlay(true)
    }

    const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowOverlay(false)
    }
  }

    const getGDriveImageUrl = (url) => {
  if (!url) return '/image-placeholder.jpg';
  
  if (url.includes('drive.google.com')) {
    // Extract file ID from various Google Drive URL formats
    let fileId;

    if (url.includes('/d/')) {
      // Format: https://drive.google.com/file/d/FILE_ID/view or /view?usp=drivesdk
      fileId = url.split('/d/')[1].split('/')[0];
    } else if (url.includes('id=')) {
      // Format: https://drive.google.com/uc?id=FILE_ID
      fileId = url.split('id=')[1].split(/[&?]/)[0]; // Handle both & and ? after the ID
    }
    
    if (fileId) {
      // Use thumbnail API for preview - this works more reliably
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
  }
  
  // Return original URL if it's not a Google Drive URL
  return url;
}

  useEffect(() => {
    

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://mument-apis.onrender.com/api/checkpoint/show-checkpoint/`);
        if (!response.ok) {
          throw new Error('Failed to fetch checkpoint submissions');
        }
        const data = await response.json();

        const transformedData = data.map(item => {
  if (item.image_url && item.image_url.includes('drive.google.com')) {
    // Extract file ID from various Google Drive URL formats
    let fileId;

    if (item.image_url.includes('/d/')) {
      // Format: https://drive.google.com/file/d/FILE_ID/view or with ?usp=drivesdk
      fileId = item.image_url.split('/d/')[1].split('/')[0];
    } else if (item.image_url.includes('id=')) {
      // Format: https://drive.google.com/uc?id=FILE_ID
      fileId = item.image_url.split('id=')[1].split(/[&?]/)[0]; // Better handling of query params
    }
    
    if (fileId) {
      // Use this specific format for embedding
      return {
        ...item,
        image: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
      };
    }
  }
  return item;
});

        setCheckpointSubmissions(transformedData);
      } catch (error) {
        console.error(error);
        setError('Failed to load checkpoint submissions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [])

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4">Community</h1>
      <p>Welcome to the community section!</p>
      <div className="mt-6">
        {/* <p className="text-gray-800">This section is under construction. Please check back later for updates.</p> */}
        <p className="text-gray-800">Here are the latest checkpoint submissions.</p>
        <p className="text-gray-800">Feel free to click on any image to view it in detail.</p>
        {/* <p className="text-gray-800">We appreciate your patience!</p> */}
        { isLoading && (
          <div className="mt-4 text-center">
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        ) }
        { error && (
          <div className="mt-4 text-red-600">
            <p>{error}</p>
          </div>
        )}
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-auto">
          {checkpointSubmissions.map((submission, index) => (
            <div 
              key={submission.id} 
              className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              data-index={index}
              onClick={handleThumbClick}
            >
              <img 
                src={getGDriveImageUrl(submission.image_url)} 
                alt={submission.title || 'Checkpoint image'} 
                className="w-full h-full max-h-100 object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/image-placeholder.jpg';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image Preview Overlay */}
      {showOverlay && selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity fade-in-out duration-100" onClick={handleOverlayClick}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 flex justify-between items-start">
              <h2 className="text-xl font-bold">{selectedSubmission.checkpoint} | {selectedSubmission.title}</h2>
              <FaXmark onClick={() => setShowOverlay(false)} className="cursor-pointer text-gray-500 hover:text-gray-800" />
            </div>
            <div className="px-4 pb-4">
              <div className="mb-4">
                <img 
                  src={getGDriveImageUrl(selectedSubmission.image_url)} 
                  alt={selectedSubmission.title} 
                  className="w-full h-auto object-contain max-h-[70vh]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/image-placeholder.jpg';
                  }} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>{selectedSubmission.description}</p>
                <p><span className="font-medium">Submitted by:</span> {selectedSubmission.email}</p>
                <p><span className="font-medium">Date:</span> {new Date(selectedSubmission.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Community