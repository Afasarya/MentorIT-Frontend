'use client';

export default function CtaOverlay() {
  return (
    <div className="relative mb-0 z-30 mt-32">
      <div className="container mx-auto px-6 sm:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          {/* CTA Card positioned more towards FAQ section */}
          <div 
            className="relative rounded-2xl overflow-hidden px-12 py-16 flex items-start justify-between"
            style={{
              backgroundImage: 'url(/images/hero/cta-footer.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: 'translateY(-110%)'
            }}
          >
            <div className="w-full flex items-start justify-between">
              {/* Left Content - Typography aligned to top with larger font */}
              <div className="text-black flex-1 pr-8">
                <h2 className="text-3xl font-bold mb-2 leading-tight">
                  Hebat Bukan?
                </h2>
                <h3 className="text-3xl font-bold mb-2 leading-tight">
                  Cerita-Cerita dari Mereka?
                </h3>
                <h4 className="text-3xl font-bold leading-tight">
                  Kini Giliranmu!
                </h4>
              </div>

              {/* Right Content - Logo at top, Button lower */}
              <div className="flex flex-col items-end">
                {/* Logo placeholder - positioned at top */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl px-8 py-4 border border-white/30 mb-16">
                  <div className="text-black text-xl font-bold">
                    LOGO
                  </div>
                </div>

                {/* CTA Button - positioned much lower */}
                <button className="bg-gray-900 hover:bg-black text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 text-base whitespace-nowrap">
                  Daftar Kelas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}