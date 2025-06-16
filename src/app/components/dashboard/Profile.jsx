'use client'
import Image from "next/image"

const Profile = ({ profile, loading, error }) => {
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      
      {profile && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            {profile.img_url && (
              <Image 
                src={profile.img_url} 
                alt="Profile Image" 
                width={100} 
                height={100} 
                className="rounded-full border-2 border-gray-200" 
              />
            )}
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-700">Phone:</p>
              <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-700">Domain:</p>
              <p className="text-gray-900">{profile.domain || 'Not specified'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-700">Team:</p>
              <p className="text-gray-900">{profile.team || 'No team assigned'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-700">μ ID:</p>
              <p className="text-gray-900">{profile.mu_id || 'Not provided'}</p>
            </div>
          </div>

          {profile.idea_submission && (
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="font-semibold text-gray-700 mb-2">Idea Submission:</p>
              <p className="text-gray-900">{profile.idea_submission}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile