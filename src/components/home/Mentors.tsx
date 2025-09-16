'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Mentors() {
  const [centerMentorId, setCenterMentorId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mentorRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mentors = [
    {
      id: 1,
      name: 'Jennifer Coolhan',
      role: 'Web Developer',
      image: '/images/mentors/mentors-1.svg',
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Mobile Developer',
      image: '/images/mentors/mentors-2.svg',
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      role: 'Data Scientist',
      image: '/images/mentors/mentors-3.svg',
    },
    {
      id: 4,
      name: 'David Chen',
      role: 'UI/UX Designer',
      image: '/images/mentors/mentors-4.svg',
    },
    {
      id: 5,
      name: 'Emily Davis',
      role: 'Full Stack Developer',
      image: '/images/mentors/mentors-5.svg',
    },
    {
      id: 6,
      name: 'Alex Thompson',
      role: 'DevOps Engineer',
      image: '/images/mentors/mentors-6.svg',
    },
    {
      id: 7,
      name: 'Lisa Wang',
      role: 'Product Manager',
      image: '/images/mentors/mentors-7.svg',
    },
  ];

  // Function to detect which mentor is in the center of viewport
  const detectCenterMentor = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestMentor = null;
    let closestDistance = Infinity;

    mentorRefs.current.forEach((mentorRef, index) => {
      if (mentorRef) {
        const mentorRect = mentorRef.getBoundingClientRect();
        const mentorCenter = mentorRect.left + mentorRect.width / 2;
        const distance = Math.abs(containerCenter - mentorCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestMentor = mentors[index % mentors.length].id;
        }
      }
    });

    setCenterMentorId(closestMentor);
  };

  // Detect center mentor on scroll and animation
  useEffect(() => {
    const interval = setInterval(detectCenterMentor, 10); // Check every 100ms
    return () => clearInterval(interval);
  }, []);

  // Initial detection
  useEffect(() => {
    const timer = setTimeout(detectCenterMentor, 100);
    return () => clearTimeout(timer);
  }, []);

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
            <span className="text-[var(--color-primary)]">#MentorTerbaikmu</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-dark-primary)] mb-4">
            Kami Hadirkan Mentor Terbaik Untukmu
          </h2>
          <p className="text-lg text-[var(--color-text-dark-secondary)] max-w-2xl mx-auto">
            Bergabung dengan course untuk ciptakan portofolio yang berdampak
          </p>
        </motion.div>

        {/* Mentors Marquee - Full width without gradient overlays */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative overflow-hidden" 
          ref={containerRef}
        >
          {/* Scrolling Content */}
          <div className="flex animate-mentors-marquee">
            {/* First set of mentors */}
            <div className="flex items-center space-x-6 flex-shrink-0">
              {mentors.map((mentor, index) => {
                const isCentered = mentor.id === centerMentorId;
                
                return (
                  <div 
                    key={`first-${index}`} 
                    ref={(el) => { mentorRefs.current[index] = el; }}
                    className="flex-shrink-0"
                  >
                    {/* Mentor Card - Smaller size */}
                    <div className="relative w-56 h-72 rounded-3xl overflow-hidden">
                      <Image
                        src={mentor.image}
                        alt={mentor.name}
                        fill
                        className={`object-cover transition-all duration-500 ${
                          isCentered ? 'filter-none' : 'filter grayscale'
                        }`}
                      />
                      
                      {/* Overlay for non-centered cards */}
                      {!isCentered && (
                        <div className="absolute inset-0 bg-black/30"></div>
                      )}
                      
                      {/* Name and Role - Only show for centered mentor */}
                      {isCentered && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-white rounded-2xl px-3 py-2 border-2 border-white shadow-sm">
                            <h3 className="text-base font-semibold text-[var(--color-text-dark-primary)] mb-1">
                              {mentor.name}
                            </h3>
                            <p className="text-xs text-[var(--color-text-dark-secondary)]">
                              {mentor.role}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center space-x-6 flex-shrink-0 ml-6">
              {mentors.map((mentor, index) => {
                const isCentered = mentor.id === centerMentorId;
                const refIndex = index + mentors.length;
                
                return (
                  <div 
                    key={`second-${index}`} 
                    ref={(el) => { mentorRefs.current[refIndex] = el; }}
                    className="flex-shrink-0"
                  >
                    {/* Mentor Card - Smaller size */}
                    <div className="relative w-56 h-72 rounded-3xl overflow-hidden">
                      <Image
                        src={mentor.image}
                        alt={mentor.name}
                        fill
                        className={`object-cover transition-all duration-500 ${
                          isCentered ? 'filter-none' : 'filter grayscale'
                        }`}
                      />
                      
                      {/* Overlay for non-centered cards */}
                      {!isCentered && (
                        <div className="absolute inset-0 bg-black/30"></div>
                      )}
                      
                      {/* Name and Role - Only show for centered mentor */}
                      {isCentered && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-white rounded-2xl px-3 py-2 border-2 border-white shadow-sm">
                            <h3 className="text-base font-semibold text-[var(--color-text-dark-primary)] mb-1">
                              {mentor.name}
                            </h3>
                            <p className="text-xs text-[var(--color-text-dark-secondary)]">
                              {mentor.role}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes mentors-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-mentors-marquee {
          animation: mentors-marquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
}