import Hero from "@/app/components/Hero"
import About from "@/app/components/About";
import Footer from "@/app/components/Footer"
import Navbar from "@/app/components/Navbar";
export default function Home() {

  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <hr className="h-[1.5px] bg-gray-600 border-0" />
      <main className="w-full fade-in-up">
        <Hero />
        <div className="rise-up [animation-timeline:view()] [animation-range:0%_cover_40%]">
          <About />
        </div> 
        <Footer />
      </main>
    </div>
  );
}
