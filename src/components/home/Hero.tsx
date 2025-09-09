'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      {/* Background Hero Image - Subtle and light */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero.png"
          alt="Hero Background"
          fill
          className="object-cover opacity-90"
          priority
        />
      </div>

      {/* Subtle background elements for depth */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-25 blur-3xl"></div>
      <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-full opacity-40 blur-2xl"></div>

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center items-center text-center pt-20">
        
        {/* Tag Line - Lowered to avoid navbar overlap */}
        <div className="inline-flex items-center px-6 py-3 bg-white border border-[var(--color-primary)] rounded-full mb-8 shadow-sm mt-12">
          <span className="text-[var(--color-primary)] text-sm font-medium">
            #RealImpactRealProject
          </span>
        </div>

        {/* Main Heading - Made smaller to fit in 1 line */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--color-text-dark-primary)] leading-tight mb-4 max-w-4xl">
          Portfolio to Meaningful Impact
        </h1>

        {/* Description - Much smaller font size */}
        <p className="text-sm sm:text-base lg:text-lg text-[var(--color-text-dark-secondary)] leading-relaxed mb-8 max-w-xl">
          Bergabung dengan course untuk ciptakan portofolio yang berdampak
        </p>

        {/* CTA Button - Raised up */}
        <button className="inline-flex items-center px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-pressed)] text-white font-semibold rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-base mb-12">
          Dapatkan Course
          <svg 
            className="ml-3 w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 8l4 4m0 0l-4 4m4-4H3" 
            />
          </svg>
        </button>

        {/* Hero Avatars - Much bigger */}
        <div className="flex justify-center">
          <Image
            src="/images/hero/hero-avatars.png"
            alt="Student Avatars"
            width={800}
            height={240}
            className="object-contain"
          />
        </div>

        {/* Left Testimonial Card - Moved higher up */}
        <div className="absolute left-4 lg:left-8 bottom-60 bg-white rounded-2xl p-5 shadow-lg max-w-xs hidden lg:block border border-gray-100">
          <div className="mb-3">
            <svg className="w-6 h-6 text-[var(--color-text-dark-tertiary)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
              <path d="M15.583 17.321c-1.03-1.094-1.583-2.321-1.583-4.31 0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
            </svg>
          </div>
          <p className="text-sm text-[var(--color-text-dark-primary)] font-medium mb-3 leading-relaxed">
            Platform kami hadir untuk kamu yang ingin menjadikan proyek nyata sebagai portofolio, sekaligus menciptakan dampak nyata.
          </p>
          <p className="text-xs text-[var(--color-text-dark-tertiary)] font-medium">- MentorIT</p>
        </div>

        {/* Right Testimonial Card - Moved much lower */}
        <div className="absolute right-4 lg:right-8 bottom-16 bg-white rounded-2xl p-5 shadow-lg max-w-xs hidden lg:block border border-gray-100">
          <div className="flex items-center space-x-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-[var(--color-text-dark-primary)] font-medium mb-3 leading-relaxed">
            "Awalnya rekomendasi dari teman, pas udah coba ikut coursenya jadi tahu kenapa temen ngerekomendasiin. Thank you MentorIT!"
          </p>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">JC</span>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-dark-primary)] font-semibold">Jane Cooper</p>
              <p className="text-xs text-[var(--color-text-disabled)]">Web Developer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}