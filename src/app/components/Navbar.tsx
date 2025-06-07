"use client";
import Image from "next/image";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#4F4CFF] text-white p-4 sm:p-6 lg:p-10 lg:py-4 relative">
      <div className="flex items-center justify-between px-2 sm:px-4 lg:px-6 lg:justify-center">
        <div className="lg:text-4xl font-bold">
          <Image
            src="/mument.png"
            width={100}
            height={100}
            alt="Logo"
            className="w-32 pt-2 md:w-48 lg:w-32"
          />
        </div>

        <div className="lg:hidden absolute top-4 right-4 sm:top-6 sm:right-6">
          <button onClick={() => setIsOpen(!isOpen)}>
            <i
              className={`fas ${isOpen ? "fa-xmark" : "fa-bars"} text-4xl md:text-6xl`}
            ></i>
          </button>
        </div>
      </div>

      <div className="hidden lg:flex justify-center space-x-6 xl:space-x-10 text-xl mt-6">
        <a href="#home" className="hover:text-black transition-colors">
          Home
        </a>
        <a href="#about" className="hover:text-black transition-colors">
          About
        </a>
        <a href="#contact" className="hover:text-black transition-colors">
          Contact
        </a>
        <a href="#enroll" className="hover:text-black transition-colors">
          Enroll
        </a>
      </div>

      {isOpen && (
        <div className="lg:hidden flex flex-col items-center space-y-4 mt-6 text-2xl md:text-3xl">
                    <a
            href="#home"
            className="hover:text-black transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="#about"
            className="hover:text-black transition-colors"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          <a
            href="#contact"
            className="hover:text-black transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </a>
          <a
            href="#enroll"
            className="hover:text-black transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Enroll
          </a>
        </div>
      )}
    </nav>
  );
}
