import Navbar from "@/components/common/Navbar";
import CourseDetail from "@/components/course/CourseDetail";
import Footer from "@/components/common/Footer";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CourseDetail courseId={params.id} />
      <Footer />
    </div>
  );
}