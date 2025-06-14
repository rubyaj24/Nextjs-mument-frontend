import React from 'react'

const ColorGrid = () => {
  return (
    <div className="bg-white shadow-md rounded-xl pt-4 mt-4 gap-4">
        <h1 className="col-span-4 text-center text-2xl font-bold mb-4">Daily Activity</h1>
        <div className="grid grid-cols-7 gap-1 p-4 max-w-md mx-auto">
            {Array.from({ length: 30 }, (_, i) => (
            <div 
                key={i} 
                className="w-8 h-8 bg-gray-200 rounded-sm hover:bg-green-200 cursor-pointer transition-colors"
                title={`Day ${i + 1}`}
            ></div>
            ))}
        </div>
    </div>
  )
}

export default ColorGrid