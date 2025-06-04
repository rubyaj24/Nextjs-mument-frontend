"use client";
import Image from "next/image";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#4F4CFF] text-white p-10 md:py-4  relative">
      <div className="flex items-center justify-between px-6 md:justify-center">
        <div className=" md:text-4xl font-bold ">
          <Image
            src="/logo.svg"
            width={100}
            height={100}
            alt="Logo"
            className=" w-60
            h-28
            md:w-32
            md:h-10
            "
          />
        </div>

        <div className="md:hidden absolute top-14 right-14">
          <button onClick={() => setIsOpen(!isOpen)}>
            <i
              className={`fas ${isOpen ? "fa-xmark" : "fa-bars"} text-7xl`}
            ></i>
          </button>
        </div>
      </div>

      <div className="hidden md:flex justify-center space-x-10 text-xl mt-6">
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

      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-6 mt-4  text-4xl">
          <a
            href="#home"
            className="hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="#about"
            className="hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          <a
            href="#contact"
            className="hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </a>
          <a
            href="#enroll"
            className="hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            Enroll
          </a>
        </div>
      )}
    </nav>
  );
}
