import Navbar from "@/components/common/Navbar";
import CourseCheckout from "@/components/course/CourseCheckout";
import Footer from "@/components/common/Footer";

export default function CheckoutPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CourseCheckout courseId={params.id} />
      <Footer />
    </div>
  );
}