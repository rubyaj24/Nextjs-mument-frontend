'use client'
import Image from "next/image";
import EnrollButton from "./DashboardButtons";

export default function About() {

  const handleLearnMore = () => {
    window.open("https://musprint-cet.vercel.app", "_blank");
  };
  return (
    <main
      id="about"
      className="bg-[#4F4CFF] text-white min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 scroll-smooth"
    >
      <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 mx-4 sm:mx-8 md:mx-16 lg:mx-20 xl:mx-30 space-y-4 sm:space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-black leading-tight">
          What is <Image src="/mument-black.png" alt="μment Logo" width={90} height={100} className="inline-block pt-2" />?
        </h1>
        <p className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed">
          μment is an exciting online event organized by μLearn, aimed at
          helping participants kickstart their project building journey.
          Participants can collaborate with others who share similar ideas, set
          checkpoints in their projects, and earn rewards for completing these
          checkpoints.
        </p>
      </div>

      <div id="enroll" className="mx-4 sm:mx-8 md:mx-16 lg:mx-20 xl:mx-30 mt-12 sm:mt-14 md:mt-16 lg:mt-20 space-y-4">
        <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-black leading-tight">
          Kickstart your journey.
        </h3>
        <p className="my-6 sm:my-8 md:my-10 lg:my-12 text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed">
          Fill out the form below to enroll in μment. Let&apos;s build your first
          project together!
        </p>
        <div className="flex justify-center">
          <EnrollButton />
        </div>
      </div>

      <section className="mt-16 sm:mt-20 md:mt-24 lg:mt-30 mx-4 sm:mx-8 md:mx-16 lg:mx-20 xl:mx-30 flex flex-col lg:flex-row lg:gap-8 xl:gap-10 justify-center items-center space-y-8 lg:space-y-0">
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[400px] xl:w-[500px] rounded-2xl sm:rounded-3xl lg:rounded-[40px] overflow-hidden">
          <Image
            src="/μlearn.png"
            alt="μLearn card"
            width={500}
            height={500}
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="w-full lg:w-[600px] xl:w-[700px] flex flex-col items-center justify-center text-center lg:text-left">
          <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black font-medium mb-6 sm:mb-8 md:mb-10">
            μSprint
          </h4>
          <div className="space-y-2 sm:space-y-3 text-center">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/80">
              Karma Mining Event
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/80">March 15, 2025</p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/80">
              Virtual Platform
            </p>
          </div>
          <button className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-sm sm:text-base md:text-lg lg:text-xl px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 border border-white rounded-md hover:bg-white hover:text-[#4B42F5] transition"
          onClick={handleLearnMore}>
            Learn More
          </button>
        </div>
      </section>
    </main>
  );
}
