'use client';

import Image from 'next/image';

export default function Marquelogo() {
  const logos = [
    { src: '/images/icons/flutter.png', alt: 'Flutter', name: 'Flutter' },
    { src: '/images/icons/vue.png', alt: 'Vue.js', name: 'Vue.js' },
    { src: '/images/icons/python.png', alt: 'Python', name: 'Python' },
    { src: '/images/icons/laravel.png', alt: 'Laravel', name: 'Laravel' },
    { src: '/images/icons/next-js.png', alt: 'Next.js', name: 'Next.js' },
    { src: '/images/icons/mysql.png', alt: 'MySQL', name: 'MySQL' },
    { src: '/images/icons/react.png', alt: 'React', name: 'React' },
    { src: '/images/icons/kotlin.png', alt: 'Kotlin', name: 'Kotlin' },
    { src: '/images/icons/java.png', alt: 'Java', name: 'Java' },
    { src: '/images/icons/go.png', alt: 'Go', name: 'Go' },
  ];

  return (
    <section className="bg-white border-8 border-white overflow-hidden">
      <div className="py-8">
        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* Scrolling Content */}
          <div className="flex animate-marquee">
            {/* First set of logos */}
            <div className="flex items-center space-x-16 flex-shrink-0">
              {logos.map((logo, index) => (
                <div 
                  key={`first-${index}`} 
                  className="flex items-center justify-center group hover:scale-110 transition-transform duration-300"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={80}
                    height={80}
                    className="object-contain w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center space-x-16 flex-shrink-0 ml-16">
              {logos.map((logo, index) => (
                <div 
                  key={`second-${index}`} 
                  className="flex items-center justify-center group hover:scale-110 transition-transform duration-300"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={80}
                    height={80}
                    className="object-contain w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}