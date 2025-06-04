"use client"
import Image from "next/image";

export default function Hero() {
 
  return (
    <>
      <section id="home" className="bg-[#4F4CFF] min-h-screen  p-24 md:py-30 md:px-42 ">
        <h1 className="text-[116px] leading-none  font-bold text-center">
          Join μment: Kickstart Your Project Building Journey!
        </h1>
        <div className="md:my-14  my-18">
          <Image
            src="/Hero.png"
            alt="Project building illustration"
            width={1200}
            height={400}
            className="w-full rounded-[40px]"
          />
        </div>
      </section>
    </>
  );
}
