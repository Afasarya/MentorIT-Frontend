'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Mentornya seru',
      content: 'Aku jadi punya pengalaman ketemu langsung sama pengurus desa yang kubantu waktu buat projek akhir',
      rating: 5,
      author: 'Ahmad Rizky',
      role: 'Mobile Developer',
      avatar: '/images/mentors/mentors-1.svg'
    },
    {
      id: 2,
      name: 'Tugas akhir beneran bermanfaat',
      content: 'Aku jadi punya pengalaman ketemu langsung sama pengurus desa yang kubantu waktu buat projek akhir',
      rating: 5,
      author: 'Sinta Dewi',
      role: 'UI/UX Designer',
      avatar: '/images/mentors/mentors-2.svg'
    },
    {
      id: 3,
      name: 'Tugas akhir beneran bermanfaat',
      content: 'Aku jadi punya pengalaman ketemu langsung sama pengurus desa yang kubantu waktu buat projek akhir',
      rating: 5,
      author: 'Budi Santoso',
      role: 'Full Stack Developer',
      avatar: '/images/mentors/mentors-3.svg'
    }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: '#f5f4fe' }}>
      <div className="container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm border border-[var(--color-primary)] rounded-full text-sm font-medium mb-4">
            <span className="text-[var(--color-primary)]">#KataMereka</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-dark-primary)] mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-lg text-[var(--color-text-dark-secondary)] max-w-2xl mx-auto">
            Bergabung dengan course untuk ciptakan portofolio yang berdampak
          </p>
        </motion.div>

        {/* Testimonials Horizontal Grid - NO WHITE BORDER */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0" style={{ backgroundColor: '#f5f4fe' }}>
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="flex"
              >
                {/* Testimonial Content - NO bg-white */}
                <div className="flex-1 p-6">
                  {/* Rating - At the very top */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote Icon */}
                  <div className="mb-4">
                    <svg className="w-8 h-8 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                      <path d="M15.583 17.321c-1.03-1.094-1.583-2.321-1.583-4.31 0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                    </svg>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] mb-3">
                    {testimonial.name}
                  </h3>

                  {/* Content */}
                  <p className="text-[var(--color-text-dark-secondary)] mb-6 leading-relaxed">
                    {testimonial.content}
                  </p>

                  {/* Author with real photo */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-dark-primary)] font-semibold">
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-[var(--color-text-dark-tertiary)]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vertical Divider - Don't show after last item */}
                {index < testimonials.length - 1 && (
                  <div className="w-px bg-gray-200 hidden lg:block"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}