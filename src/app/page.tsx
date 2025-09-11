import Navbar from "@/components/common/Navbar";
import Hero from "@/components/home/Hero";
import Marquelogo from "@/components/home/Marquelogo";
import Coursehome from "@/components/home/Coursehome";
import Coursecategory from "@/components/home/Coursecategory";
import Mentors from "@/components/home/Mentors";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
import CtaOverlay from "@/components/home/CtaOverlay";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Marquelogo />
      <Coursehome />
      <Coursecategory />
      <Mentors />
      <Testimonials />
      <Faq />
      <CtaOverlay />
      <Footer />
    </div>
  );
}
