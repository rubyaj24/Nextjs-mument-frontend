import Image from "next/image";

export default function Hero() {
 
  return (
    <>
      <section id="home" className="bg-[#4F4CFF] p-4 sm:p-8 md:p-16 lg:p-24 xl:py-30 xl:px-42">
        <h1 className="text-5xl md:text-6xl lg:text-8xl xl:text-9xl leading-tight font-bold text-center text-white mb-8 sm:mb-12 md:mb-16 lg:mb-20">
          Join <Image src="/Vector.svg" alt="μment Logo" width={50} height={100} className="inline-block w-38 md:w-64 lg:w-96 mt-2 mx-2" />: Kickstart Your Project Building Journey!
        </h1>
        <div className="w-full max-w-6xl mx-auto">
          <Image
            src="/Hero.png"
            alt="Project building illustration"
            width={1200}
            height={400}
            className="w-full h-auto rounded-2xl sm:rounded-3xl lg:rounded-[40px] shadow-lg"
            priority
          />
        </div>
      </section>
    </>
  );
}
