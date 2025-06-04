import Image from "next/image";

export default function About() {
  return (
    <main
      id="about"
      className="bg-[#4F4CFF] text-white min-h-screen p-4 md:py-10 md:px-10"
    >
      <div className="mx-20 md:mx-30  space-y-6">
        <h1 className="text-6xl font-medium text-black">What is μment?</h1>
        <p className="mt-12 text-4xl ">
          μment is an exciting online event organized by μLearn, aimed at
          helping participants kickstart their project building journey.
          Participants can collaborate with others who share similar ideas, set
          checkpoints in their projects, and earn rewards for completing these
          checkpoints.
        </p>
      </div>

      <div id="enroll" className="mx-20 mt-16 md:mt-20 md:mx-30 space-y-4">
        <h3 className="text-6xl font-medium text-black">
          Kickstart your journey.
        </h3>
        <p className="my-12 text-4xl">
          Fill out the form below to enroll in μment. Let’s build your first
          project together!
        </p>
        <div className="flex justify-center">
          <button className="bg-white  text-black w-[350px] h-[65px] text-3xl font-semibold  rounded-full hover:scale-110 transition duration-300 ">
            get started
          </button>
        </div>
      </div>

      <section className="m-30  flex flex-col md:flex-row md:gap-10 justify-center items-center">
        <div className="relative w-[500px]   rounded-[40px] md:rounded-4xl overflow-hidden ">
          <Image
            src="/μlearn.png"
            alt="μLearn card"
            width={500}
            height={500}
            className="object-cover mx-auto md:mx-0"
          />
        </div>
        <div className=" h-[500px] w-[700px] flex flex-col items-center justify-center">
          <h4 className="text-7xl  text-black font-medium mb-10">
            μLearn Team
          </h4>
          <div className="space-y-1 text-center">
            <p className="text-2xl text-white/80">Interactive Workshop</p>
            <p className="text-2xl text-white/80">March 15, 2024</p>
            <p className="text-2xl text-white/80">Virtual Platform</p>
          </div>
          <button className="mt-12 text-lg px-6 py-2 border border-white rounded-md hover:bg-white hover:text-[#4B42F5] transition">
            Learn More
          </button>
        </div>
      </section>
    </main>
  );
}
