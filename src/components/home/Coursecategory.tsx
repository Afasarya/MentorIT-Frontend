import Image from 'next/image';

export default function Coursecategory() {
  const categories = [
    {
      id: 1,
      title: 'Web Development',
      description: 'Belajar coding dari pemula sampai jago bikin website',
      courseCount: '6+ course',
      image: '/images/category-web.png',
      bgColor: 'bg-purple-50',
    },
    {
      id: 2,
      title: 'Mobile Development',
      description: 'Belajar coding dari pemula sampai jago bikin website',
      courseCount: '6+ course',
      image: '/images/category-mobile.png',
      bgColor: 'bg-purple-50',
    },
    {
      id: 3,
      title: 'Data Science',
      description: 'Belajar coding dari pemula sampai jago bikin website',
      courseCount: '6+ course',
      image: '/images/category-datascience.png',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <section className="py-16" style={{ backgroundColor: '#f5f4fe' }}>
      <div className="container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm border border-[var(--color-primary)] rounded-full text-sm font-medium mb-4">
            <span className="text-[var(--color-primary)]">#KategoriCourse</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-dark-primary)] mb-4">
            Kategori Course
          </h2>
          <p className="text-lg text-[var(--color-text-dark-secondary)] max-w-2xl mx-auto">
            Bergabung dengan course untuk ciptakan portofolio yang berdampak
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl px-8 py-10 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              {/* Horizontal Layout: Image + Content */}
              <div className="flex items-center space-x-6">
                {/* Category Image - Left Side */}
                <div className={`${category.bgColor} rounded-full p-6 flex-shrink-0`}>
                  <div className="relative w-20 h-20">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                </div>

                {/* Category Content - Right Side */}
                <div className="flex-1 space-y-5">
                  <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-dark-secondary)] leading-relaxed">
                    {category.description}
                  </p>

                  {/* Course Count Button */}
                  <button className="inline-flex items-center px-5 py-2.5 bg-[var(--color-text-dark-primary)] text-white rounded-full text-sm font-medium hover:bg-[var(--color-primary)] transition-all duration-200 group-hover:bg-[var(--color-primary)]">
                    {category.courseCount}
                    <svg 
                      className="ml-2 w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}