import Navbar from "@/components/common/Navbar";
import Catalog from "@/components/course/Catalog";
import Footer from "@/components/common/Footer";

export default function CatalogPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Catalog />
      <Footer />
    </div>
  );
}