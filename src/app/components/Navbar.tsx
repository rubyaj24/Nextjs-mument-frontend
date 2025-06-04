"use client";
import Image from 'next/image';



export default function Navbar() {
  return (
    <nav className="bg-[#4F4CFF] text-white py-4 shadow">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="text-4xl font-bold"><Image src="/logo.svg" width={100} height={100} alt="Logo" /></div>
        <div className="flex space-x-10 text-xl  mt-6">
          <a href="#home" className="hover:text-black">
            Home
          </a>
          <a href="#about" className="hover:text-black">
            About
          </a>
          <a href="#contact" className="hover:text-black">
            Contact
          </a>
          <a href="#enroll" className="hover:text-black">
            Enroll
          </a>
        </div>
      </div>
    </nav>
  );
}
