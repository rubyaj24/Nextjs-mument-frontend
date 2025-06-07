'use client'

import { FC } from 'react'

const EnrollButton: FC = () => {
  const handleEnrollClick = (): void => {
    window.location.href = "https://airtable.com/appDLuq08n7OULUKo/shr4WjMH0fFE2FT2w"
  }

  return (
    <button 
      className="bg-white text-black w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[350px] xl:w-[450px] h-12 sm:h-14 md:h-16 lg:h-[65px] xl:h-[80px] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold rounded-full hover:scale-105 transition duration-300"
      onClick={handleEnrollClick}
    >
      get started
    </button>
  )
}

export default EnrollButton