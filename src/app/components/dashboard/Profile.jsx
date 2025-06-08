'use client'

import Image from "next/image"

const Profile = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="text-gray-600">Welcome to <Image src="/mument-black.png" alt="Dashboard" width={50} height={100} className='px-1 inline-block'/> Dashboard</p>
        <div className="mt-6">
            <p className="text-gray-800">This section is under construction. Please check back later for updates.</p>
            <p className="text-gray-800">We appreciate your patience!</p>
        </div>
    </div>
  )
}

export default Profile