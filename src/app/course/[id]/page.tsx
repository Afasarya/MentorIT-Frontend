'use client';

import React from 'react';
import Navbar from "@/components/common/Navbar";
import CourseDetail from "@/components/course/CourseDetail";
import Footer from "@/components/common/Footer";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <CourseDetail courseId={resolvedParams.id} />
      <Footer />
    </div>
  );
}