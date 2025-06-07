"use client";

import Image from "next/image";
import { useState } from "react";

export default function SubscribePage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
  };

  return (
    <section
      id="contact"
      className="min-h-screen sm:min-h-[90vh] md:min-h-[80vh] flex flex-col items-center justify-center bg-[#282786] text-white p-4 sm:p-6 md:p-8"
    >
      <h1 className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-center leading-tight">
        Stay Connected with μLearn
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-4xl px-4"
      >
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5 lg:py-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl w-full sm:flex-1 max-w-lg rounded-xl sm:rounded-2xl bg-[#4F4CFF] text-white placeholder-white outline-none"
        />
        <button
          type="submit"
          className="bg-black text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 lg:py-6 rounded-xl sm:rounded-2xl hover:scale-105 transition duration-300 w-full sm:w-auto"
        >
          Subscribe
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 md:mt-12 lg:mt-16 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        <a
          href="http://www.facebook.com/gtechmulearn"
          aria-label="Facebook"
          className="hover:text-blue-400 transition-colors"
        >
          <i className="fab fa-facebook-square"></i>
        </a>
        <a
          href="https://www.instagram.com/mulearn.official/"
          aria-label="Instagram"
          className="hover:text-pink-400 transition-colors"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="https://www.linkedin.com/company/gtechmulearn/"
          aria-label="LinkedIn"
          className="hover:text-blue-500 transition-colors"
        >
          <i className="fab fa-linkedin"></i>
        </a>
        <a
          href="https://discord.com/channels/771670169691881483/"
          aria-label="Discord"
          className="hover:text-purple-400 transition-colors"
        >
          <i className="fab fa-discord"></i>
        </a>
      </div>
      <div className="absolute bottom-6 md:bottom-8 lg:bottom-10 xl:bottom-12">
        <Image
          src="/logo.svg"
          width={100}
          height={100}
          alt="Footer Logo"
          className="w-32 md:w-48 lg:w-64"
        />
      </div>
    </section>
  );
}
