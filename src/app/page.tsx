import Navbar from "@/components/common/Navbar";
import Hero from "@/components/home/Hero";
import Marquelogo from "@/components/home/Marquelogo";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Marquelogo />
    </div>
  );
}
