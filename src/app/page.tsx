import Navbar from "@/components/common/Navbar";
import Hero from "@/components/home/Hero";
import Marquelogo from "@/components/home/Marquelogo";
import Coursehome from "@/components/home/Coursehome";
import Coursecategory from "@/components/home/Coursecategory";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Marquelogo />
      <Coursehome />
      <Coursecategory />
    </div>
  );
}
