
import Hero from "@/app/components/Hero"
import About from "./components/About";
import Footer from "./components/Footer"
import Navbar from "./components/Navbar";
export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <hr className="h-[1.5px] bg-gray-600 border-0" />
      <main className="w-full fade-in-up">
        <Hero />
        <About />
        <Footer />
      </main>
    </div>
  );
}
