import React from 'react'

const Community = () => {

  const demoimage = [
    'https://placehold.co/150',
    'https://placehold.co/600x400',
    'https://placehold.co/150',
    ]

  return (
    <div className="p-2">
        <h1 className="text-2xl font-bold mb-4">Community</h1>
        <p>Welcome to the community section!</p>
        <div className="mt-6">
            <p className="text-gray-800">This section is under construction. Please check back later for updates.</p>
            <p className="text-gray-800">We appreciate your patience!</p>
        </div>
        <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-auto">
              {demoimage.map((image, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <img src={image} alt={`Demo ${index + 1}`} className="w-full h-auto rounded" />
                </div>
              ))}
              <div className="bg-white rounded-lg shadow-md p-4 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-3 row-span-2">Item 1</div>
              <div className="bg-white rounded-lg shadow-md p-4 col-span-1 row-span-1">Item 2</div>
              <div className="bg-white rounded-lg shadow-md p-4 col-span-1 row-span-1">Item 3</div>
              <div className="bg-white rounded-lg shadow-md p-4 col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 row-span-1">Item 4</div>
              <div className="bg-white rounded-lg shadow-md p-4 col-span-1 row-span-2">Item 5</div>
              <div className="bg-white rounded-lg shadow-md p-4 col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1 row-span-1">Item 6</div>
            </div>
        </div>
    </div>
  )
}

export default Community