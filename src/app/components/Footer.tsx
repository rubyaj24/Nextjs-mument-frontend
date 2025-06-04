"use client";

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
      className="min-h-screen md:min-h-[80vh] flex flex-col items-center justify-center bg-[#282786] text-white "
    >
      <h1 className="mt-20 md:text-3xl text-[60px] font-semibold text-center">
        Stay Connected with μLearn
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-10 py-6 md:px-6 md:text-xl text-3xl 
           md:py-3 w-[560px] md:w-[440px] rounded-2xl md:rounded bg-[#4F4CFF] text-white placeholder-white outline-none"
        />
        <button
          type="submit"
          className="bg-black text-white text-3xl px-12 py-4 md:px-8 md:py-3 rounded-2xl  md:rounded hover:scale-110 transition duration-300 "
        >
          Subscribe
        </button>
      </form>

      <div className="flex space-x-6 mt-16 md:mt-12 text-5xl md:text-[40px]  ">
        <a href="http://www.facebook.com/gtechmulearn" aria-label="Facebook">
          <i className="fab fa-facebook-square"></i>
        </a>
        <a
          href="https://www.instagram.com/mulearn.official/"
          aria-label="Instagram"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" aria-label="X (Twitter)">
          <i className="fab fa-x-twitter"></i>
        </a>
        <a
          href="https://www.linkedin.com/company/gtechmulearn/"
          aria-label="LinkedIn"
        >
          <i className="fab fa-linkedin"></i>
        </a>
        <a
          href="https://discord.com/channels/771670169691881483/"
          aria-label="Discord"
        >
          <i className="fab fa-discord "></i>
        </a>
      </div>
    </section>
  );
}
